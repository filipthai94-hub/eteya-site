/**
 * SCB API Client
 * Hämtar branschstatistik från SCB PxWeb API
 * 
 * Input: SNI-kod (t.ex. "47910" för e-handel)
 * Output: { genomsnittligLon, omsattningPerAnstalld, branschtillvaxt }
 */

const axios = require('axios');

// SCB PxWeb API v2 endpoint för branschnyckeltal
const SCB_BASE_URL = 'https://www.statistikdatabasen.scb.se/pxweb/api/api/sv/ssd/START__NV__NV0109__NV0109O/BNTT01';

/**
 * Hämta branschstatistik för given SNI-kod
 * 
 * @param {string} sniCode - SNI-kod (5 siffror, t.ex. "47910")
 * @returns {Promise<object>} Branschstatistik
 */
async function getIndustryStats(sniCode) {
  console.log('Hämtar SCB statistik för SNI:', sniCode);
  
  try {
    // SCB PxWeb API kräver POST med JSON body
    const response = await axios.post(
      SCB_BASE_URL + '/data',
      {
        query: [
          {
            code: 'SNI2007',
            selection: {
              filter: 'item',
              values: [sniCode]
            }
          },
          {
            code: 'år',
            selection: {
              filter: 'item',
              values: ['2023'] // Senaste tillgängliga året
            }
          },
          {
            code: 'Storleksklass',
            selection: {
              filter: 'item',
              values: ['000'] // Totalt alla storlekar
            }
          }
        ],
        response: {
          format: 'json'
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    // Parsa SCB response
    const data = response.data;
    
    if (!data || !data.data || data.data.length === 0) {
      console.log('Ingen data tillgänglig för denna SNI-kod');
      return {
        genomsnittligLon: null,
        omsattningPerAnstalld: null,
        branschtillvaxt: null,
        raw: data
      };
    }
    
    // Extrahera värden från SCB response
    const stats = parseScbResponse(data, sniCode);
    
    console.log('✅ SCB statistik hämtad:', stats);
    
    return stats;
    
  } catch (error) {
    if (error.response) {
      console.error('❌ SCB API error:', error.response.status);
      // Vid 404 eller andra fel, returnera default-värden
    } else {
      console.error('❌ Fel vid SCB-anrop:', error.message);
    }
    
    // Returnera default-värden vid fel
    return {
      genomsnittligLon: 45000, // Schablonvärde
      omsattningPerAnstalld: 600000, // Schablonvärde
      branschtillvaxt: null,
      error: error.message
    };
  }
}

/**
 * Parsa SCB response till vårt format
 */
function parseScbResponse(scbData, sniCode) {
  // SCB response struktur:
  // {
  //   "data": [
  //     {
  //       "values": [45000, 625000, 3.2],
  //       "codes": ["47910", "2023"],
  //       "dimensions": [...]
  //     }
  //   ],
  //   "meta": {...}
  // }
  
  const values = scbData.data[0]?.values || [];
  
  // Mappa värden till vårt format
  // Notera: SCB kan returnera värden i olika ordning beroende på tabell
  // Vi antar följande ordning baserat på NV0109O/BNTT01:
  // [0] = Antal anställda
  // [1] = Nettoomsättning (tkr)
  // [2] = Lönesumma (tkr)
  // [3] = Antal företag
  
  const antalAnstallda = values[0] || null;
  const nettoOmsattning = values[1] ? values[1] * 1000 : null; // Omvandla från tkr till kr
  const lonesumma = values[2] ? values[2] * 1000 : null; // Omvandla från tkr till kr
  const antalForetag = values[3] || null;
  
  // Beräkna härledda värden
  const genomsnittligLon = antalAnstallda && lonesumma 
    ? Math.round(lonesumma / antalAnstallda)
    : null;
  
  const omsattningPerAnstalld = antalAnstallda && nettoOmsattning
    ? Math.round(nettoOmsattning / antalAnstallda)
    : null;
  
  // Branschtillväxt kräver data från flera år - returnera null för nu
  // Kan implementeras senare genom att fråga efter flera år
  const branschtillvaxt = null;
  
  return {
    genomsnittligLon,
    omsattningPerAnstalld,
    branschtillvaxt,
    raw: {
      antalAnstallda,
      nettoOmsattning,
      lonesumma,
      antalForetag
    }
  };
}

// Export för module use
module.exports = { getIndustryStats };

// Kör om scriptet körs direkt
if (require.main === module) {
  const sniCode = process.argv[2];
  if (!sniCode) {
    console.error('Användning: node scb.js <SNI-kod>');
    console.error('Exempel: node scb.js 47910');
    process.exit(1);
  }
  
  getIndustryStats(sniCode)
    .then(data => {
      console.log('\n=== SCB STATISTIK ===');
      console.log(JSON.stringify(data, null, 2));
    })
    .catch(err => {
      console.error('Fel:', err.message);
      process.exit(1);
    });
}
