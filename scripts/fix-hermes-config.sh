#!/bin/bash

# ============================================================
# FIXA HERMES CONFIG - ETEYA
# Rättar platsen för api_key och base_url
# ============================================================

echo "🔧 Fixar Hermes config..."

cd ~/.hermes

# Återställ från backup
if [ -f "config.yaml.backup.20260422" ]; then
    cp config.yaml.backup.20260422 config.yaml.fixed
else
    # Om backup saknas, använd nuvarande och rensa bort felaktiga rader
    grep -v "api_key: sk-" config.yaml > config.yaml.fixed
fi

# Använd Python för att fixa YAML korrekt
python3 -c "
import yaml

with open('config.yaml.fixed', 'r') as f:
    config = yaml.safe_load(f)

# Fixa model-sektionen
config['model']['base_url'] = 'https://api.ollama.com/v1'
config['model']['api_key'] = 'ske62da3ad42e34b9fa6aaf65eb93f66f2.WYcTKyNeMESg1nD0I0xLZAG7'
config['model']['default'] = 'kimi-k2.6:cloud'
config['model']['provider'] = 'ollama-cloud'

# Ta bort api_key från root-nivå om den finns där
if 'api_key' in config and isinstance(config['api_key'], str):
    del config['api_key']

with open('config.yaml', 'w') as f:
    yaml.dump(config, f, default_flow_style=False, sort_keys=False)

print('✅ Config fixad!')
"

echo ""
echo "Verifierar nya inställningar:"
grep -A5 "^model:" config.yaml

echo ""
echo "✅ KLART! Starta om Hermes nu."
