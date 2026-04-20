#!/usr/bin/env python3
"""
SCB API Client — Företagsregister
Söker företag via orgnr med certifikatbaserad auth.
Returnerar: orgnr, namn, adress, SNI, anställda, omsättning, etc.

Usage:
  python scb_client.py lookup 5591279889
  python scb_client.py search "Telestore" --kommun 1780 --bransch 47
"""

import json
import sys
import subprocess
import tempfile
import os
import requests
from pathlib import Path
from requests.packages.urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

# Config
SCB_BASE_URL = "https://privateapi.scb.se/nv0101/v1/sokpavar/api/je/HamtaForetag"
SCB_API_ID = "A01139"
CERT_PATH = Path.home() / ".openclaw" / "secrets" / "scb_cert.pfx"
CERT_PASSWORD = "2yLfAxtr45rn"

# Default fallback stats per SNI code
DEFAULT_STATS = {
    "47401": {"genomsnittligLon": 42000, "omsattningPerAnstalld": 550000},
    "47910": {"genomsnittligLon": 45000, "omsattningPerAnstalld": 600000},
    "62010": {"genomsnittligLon": 52000, "omsattningPerAnstalld": 750000},
    "62020": {"genomsnittligLon": 55000, "omsattningPerAnstalld": 800000},
    "70220": {"genomsnittligLon": 48000, "omsattningPerAnstalld": 650000},
}


def pfx_to_pem():
    """Convert PFX to PEM cert+key files for requests library"""
    cert_pem = tempfile.mktemp(suffix='.pem')
    key_pem = tempfile.mktemp(suffix='.pem')
    
    try:
        subprocess.run([
            'openssl', 'pkcs12', '-in', str(CERT_PATH),
            '-clcerts', '-nokeys', '-out', cert_pem,
            '-passin', f'pass:{CERT_PASSWORD}'
        ], capture_output=True, check=True)
        
        subprocess.run([
            'openssl', 'pkcs12', '-in', str(CERT_PATH),
            '-nocerts', '-out', key_pem,
            '-passin', f'pass:{CERT_PASSWORD}',
            '-nodes'
        ], capture_output=True, check=True)
        
        return cert_pem, key_pem
    except Exception as e:
        raise RuntimeError(f"PFX→PEM conversion failed: {e}")


def cleanup_pem(cert_pem, key_pem):
    for f in [cert_pem, key_pem]:
        try:
            os.unlink(f)
        except:
            pass


def lookup_company(orgnr):
    """Slå upp företag på orgnr via SCB cert-API.
    
    OBS: SCB filtrerar INTE på orgnr — returnerar första företaget med matchande SNI.
    Använd Apiverket (apiverket.js) för exakt orgnr-lookup istället.
    Denna funktion är bara användbar för att hämta branschdata per kommun+SNI.
    """
    cert_pem, key_pem = pfx_to_pem()
    
    try:
        # Clean orgnr
        clean_orgnr = orgnr.replace('-', '')
        
        payload = {
            'OrgNr': clean_orgnr,
            'Kategorier': [
                {'Kategori': '2-siffrig bransch 1', 'Kod': ['47']},
                {'Kategori': 'Företagsstatus', 'Kod': ['1']}
            ],
            'AntalPoster': 50
        }
        
        response = requests.post(
            SCB_BASE_URL,
            json=payload,
            cert=(cert_pem, key_pem),
            verify=False,
            headers={
                'Content-Type': 'application/json',
                'X-API-ID': SCB_API_ID
            },
            timeout=15
        )
        
        if response.status_code != 200:
            print(f"SCB API error: {response.status_code}", file=sys.stderr)
            return None
        
        data = response.json()
        
        if not isinstance(data, list):
            return None
        
        # Find matching orgnr
        for company in data:
            if company.get('OrgNr') == clean_orgnr or company.get('PeOrgNr', '').endswith(clean_orgnr):
                return format_scb_result(company)
        
        # If no exact match, return first result
        if len(data) > 0:
            return format_scb_result(data[0])
        
        return None
        
    except Exception as e:
        print(f"SCB lookup error: {e}", file=sys.stderr)
        return None
    finally:
        cleanup_pem(cert_pem, key_pem)


def search_by_name(name, sni_code=None, municipality_code=None, limit=10):
    """Sök företag på namn med valfria filter."""
    cert_pem, key_pem = pfx_to_pem()
    
    try:
        kategorier = [
            {'Kategori': 'Företagsstatus', 'Kod': ['1']}
        ]
        
        if sni_code:
            kategorier.append({'Kategori': '2-siffrig bransch 1', 'Kod': [sni_code[:2]]})
        
        if municipality_code:
            kategorier.append({'Kategori': 'Säteskommun', 'Kod': [municipality_code]})
        
        payload = {
            'FretagNamn': name,
            'Kategorier': kategorier,
            'AntalPoster': limit
        }
        
        response = requests.post(
            SCB_BASE_URL,
            json=payload,
            cert=(cert_pem, key_pem),
            verify=False,
            headers={
                'Content-Type': 'application/json',
                'X-API-ID': SCB_API_ID
            },
            timeout=15
        )
        
        if response.status_code != 200:
            print(f"SCB API error: {response.status_code}", file=sys.stderr)
            return []
        
        data = response.json()
        
        if not isinstance(data, list):
            return []
        
        return [format_scb_result(c) for c in data]
        
    except Exception as e:
        print(f"SCB search error: {e}", file=sys.stderr)
        return []
    finally:
        cleanup_pem(cert_pem, key_pem)


def format_scb_result(company):
    """Formatera SCB-resultat till vårt briefing-format"""
    # Extract SNI code (prefer 5-digit, fallback to 2-digit)
    sni_code = company.get('Bransch_1, kod', '').strip()
    sni_desc = company.get('Bransch_1', '').strip()
    
    # Parse employees
    emp_str = company.get('Storleksklass SME', '').strip()
    employees = 0
    if emp_str and 'anställda' in emp_str:
        try:
            # "1-4 anställda" → take midpoint
            nums = [int(s) for s in emp_str.replace('-', ' ').replace('anställda', '').split() if s.isdigit()]
            if len(nums) >= 2:
                employees = (nums[0] + nums[-1]) // 2
            elif len(nums) == 1:
                employees = nums[0]
        except:
            pass
    
    return {
        "name": company.get("Företagsnamn", "").strip(),
        "orgnr": company.get("OrgNr", "").strip(),
        "address": company.get("PostAdress", "").strip(),
        "postal_code": company.get("PostNr", "").strip(),
        "city": company.get("PostOrt", "").strip(),
        "visit_address": company.get("HAE_BesöksAdress", "").strip() or company.get("BesöksAdress", "").strip(),
        "sni_code": sni_code,
        "sni_description": sni_desc,
        "employees": employees,
        "employee_class": emp_str,
        "legal_form": company.get("Juridisk form", "").strip(),
        "legal_form_code": company.get("Juridisk form, kod", "").strip(),
        "status": company.get("Företagsstatus", "").strip(),
        "email": company.get("E-post", "").strip(),
        "phone": company.get("Telefon", "").strip(),
        "municipality": company.get("Säteskommun", "").strip(),
        "county": company.get("Säteslän", "").strip(),
        "revenue_class": company.get("Storleksklass Fin, oms", "").strip(),
        "vat_registered": company.get("Momsstatus", "").strip() == "Är registrerad för moms",
        "ftax_registered": company.get("Fskattstatus", "").strip() == "Är registrerad för F-skatt",
        "start_date": company.get("Startdatum", "").strip(),
    }


def get_industry_stats(sni_code):
    """Hämta genomsnittslön och omsättning per anställd för SNI-kod"""
    if not sni_code:
        return DEFAULT_STATS.get("47910", DEFAULT_STATS["47910"])
    
    # Try exact match first
    if sni_code in DEFAULT_STATS:
        return DEFAULT_STATS[sni_code]
    
    # Try 2-digit match
    prefix = sni_code[:2]
    for key in DEFAULT_STATS:
        if key.startswith(prefix):
            return DEFAULT_STATS[key]
    
    return DEFAULT_STATS["47910"]


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='SCB API Client')
    parser.add_argument('action', choices=['lookup', 'search', 'stats'])
    parser.add_argument('query', help='Orgnr for lookup, name for search, SNI code for stats')
    parser.add_argument('--sni', help='SNI code filter for search')
    parser.add_argument('--kommun', help='Municipality code for search')
    parser.add_argument('--limit', type=int, default=10, help='Max results')
    
    args = parser.parse_args()
    
    if args.action == 'lookup':
        result = lookup_company(args.query)
        if result:
            print(json.dumps(result, ensure_ascii=False, indent=2))
        else:
            print(json.dumps({"error": "Företag hittades inte"}))
    
    elif args.action == 'search':
        results = search_by_name(
            args.query,
            sni_code=args.sni,
            municipality_code=args.kommun,
            limit=args.limit
        )
        if results:
            print(json.dumps(results, ensure_ascii=False, indent=2))
        else:
            print(json.dumps({"error": "Inga träffar"}))
    
    elif args.action == 'stats':
        stats = get_industry_stats(args.query)
        print(json.dumps(stats, ensure_ascii=False, indent=2))