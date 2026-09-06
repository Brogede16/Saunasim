(function(global){
'use strict';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const round=(n,d=0)=>+Number(n).toFixed(d);
const money=n=>Math.round(n).toLocaleString('da-DK')+' kr.';
const pct=n=>Math.round(n*100)+'%';
const uid=(p='id')=>p+'_'+Math.random().toString(36).slice(2,10);
function RNG(seed=123456789){let x=seed>>>0;return()=>{x=(1664525*x+1013904223)>>>0;return x/4294967296}}
const pick=(a,r=Math.random)=>a[Math.floor(r()*a.length)];
const weighted=(arr,getWeight,r=Math.random)=>{let sum=arr.reduce((s,x)=>s+Math.max(0,getWeight(x)),0);if(sum<=0)return arr[0];let v=r()*sum;for(const x of arr){v-=Math.max(0,getWeight(x));if(v<=0)return x}return arr[arr.length-1]};

const ROOM_CATALOG={
 reception:{name:'Reception',icon:'▣',cost:4200,unlock:1,baseCap:32,style:1,comfort:1,heat:0,ritual:0,wellness:0,social:0,flow:7,service:4,utility:30,staff:{host:1},desc:'Controls check-in speed and first impression.'},
 sauna:{name:'Sauna',icon:'♨',cost:8500,unlock:1,baseCap:18,style:2,comfort:1,heat:8,ritual:5,wellness:1,social:1,flow:0,service:0,utility:95,staff:{master:0},desc:'Core heat room. Required to operate.'},
 shower:{name:'Showers',icon:'⋮',cost:3800,unlock:1,baseCap:16,style:1,comfort:5,heat:0,ritual:0,wellness:3,social:0,flow:5,service:0,utility:50,staff:{},desc:'Improves turnover and comfort.'},
 cold:{name:'Cold Plunge',icon:'≈',cost:5200,unlock:1,baseCap:8,style:2,comfort:3,heat:-1,ritual:2,wellness:7,social:0,flow:1,service:0,utility:40,staff:{},desc:'Recovery amenity with strong wellness appeal.'},
 lounge:{name:'Lounge',icon:'▰',cost:6500,unlock:1,baseCap:24,style:5,comfort:8,heat:0,ritual:1,wellness:2,social:7,flow:2,service:1,utility:22,staff:{},desc:'Extends stays, loyalty and secondary spend.'},
 bar:{name:'Tea Bar',icon:'◒',cost:7800,unlock:2,baseCap:18,style:5,comfort:5,heat:0,ritual:2,wellness:2,social:6,flow:1,service:5,utility:35,staff:{host:1},desc:'Drives spend and social appeal.'},
 premium:{name:'Premium Sauna',icon:'◆',cost:15500,unlock:3,baseCap:28,style:7,comfort:4,heat:9,ritual:9,wellness:2,social:2,flow:0,service:0,utility:140,staff:{},desc:'High-capacity ritual room with premium appeal.'},
 garden:{name:'Steam Garden',icon:'✦',cost:13000,unlock:4,baseCap:24,style:9,comfort:8,heat:1,ritual:5,wellness:8,social:6,flow:2,service:1,utility:30,staff:{cleaner:1},desc:'Signature outdoor recovery and social space.'},
 locker:{name:'Changing Room',icon:'▤',cost:5600,unlock:2,baseCap:32,style:2,comfort:6,heat:0,ritual:0,wellness:1,social:0,flow:8,service:0,utility:25,staff:{},desc:'Reduces entry bottlenecks and crowding.'},
 quiet:{name:'Quiet Room',icon:'◌',cost:9200,unlock:4,baseCap:14,style:6,comfort:9,heat:0,ritual:3,wellness:8,social:-2,flow:0,service:0,utility:15,staff:{},desc:'Premium calm space for wellness and quiet guests.'}
};

const GUEST_TYPES=[
 {id:'local',name:'Local Regular',icon:'●',weight:26,price:.95,spend:1.0,review:.8,loyalty:1.35,prefs:{heat:.65,ritual:.45,wellness:.55,social:.55,style:.35,comfort:.6,quiet:.4}},
 {id:'nerd',name:'Sauna Nerd',icon:'▲',weight:15,price:1.15,spend:1.1,review:1.35,loyalty:1.1,prefs:{heat:1,ritual:1,wellness:.55,social:.15,style:.45,comfort:.35,quiet:.55}},
 {id:'wellness',name:'Wellness Seeker',icon:'◇',weight:18,price:1.25,spend:1.3,review:1,loyalty:1.15,prefs:{heat:.4,ritual:.55,wellness:1,social:.2,style:.75,comfort:1,quiet:.8}},
 {id:'crew',name:'Afterwork Crew',icon:'■',weight:15,price:1.0,spend:1.2,review:.8,loyalty:.85,prefs:{heat:.55,ritual:.45,wellness:.25,social:1,style:.65,comfort:.55,quiet:.05}},
 {id:'tourist',name:'City Tourist',icon:'◆',weight:16,price:1.3,spend:1.45,review:1.1,loyalty:.3,prefs:{heat:.55,ritual:.75,wellness:.55,social:.65,style:1,comfort:.65,quiet:.25}},
 {id:'purist',name:'Quiet Purist',icon:'○',weight:10,price:.9,spend:.9,review:1.25,loyalty:1.45,prefs:{heat:.9,ritual:.75,wellness:.75,social:.05,style:.25,comfort:.65,quiet:1}}
];

const STAFF_ROLES={
 host:{name:'Host',icon:'H',wage:26500,hire:3500,desc:'Check-in, guest service and sales.',primary:'service'},
 cleaner:{name:'Cleaner',icon:'C',wage:24500,hire:3000,desc:'Cleanliness and room reset speed.',primary:'clean'},
 master:{name:'Goose Master',icon:'G',wage:32000,hire:5000,desc:'Runs Sauna Goose sessions and determines ritual quality.',primary:'ritual'},
 manager:{name:'Manager',icon:'M',wage:38500,hire:7000,desc:'Reduces staff fatigue, stabilises operations and enables automation.',primary:'manage'}
};
const STAFF_TRAITS=[
 {id:'warm',name:'Warm host',roles:['host','manager'],effect:{service:.12},desc:'+12% service'},
 {id:'seller',name:'Natural seller',roles:['host'],effect:{secondary:.16},desc:'+16% secondary spend'},
 {id:'meticulous',name:'Meticulous',roles:['cleaner'],effect:{clean:.18},desc:'+18% cleaning'},
 {id:'efficient',name:'Efficient',roles:['cleaner','manager'],effect:{utility:-.06},desc:'-6% utility use'},
 {id:'showman',name:'Showmanship',roles:['master'],effect:{goose:.15},desc:'+15% Goose quality'},
 {id:'traditionalist',name:'Traditionalist',roles:['master'],effect:{heat:.12},desc:'+12% heat Goose appeal'},
 {id:'mentor',name:'Mentor',roles:['manager','master'],effect:{training:.18},desc:'+18% staff XP'},
 {id:'steady',name:'Steady',roles:['manager'],effect:{morale:.15},desc:'+15% morale recovery'}
];

const DEFAULT_GOOSE=[
 {id:'classic',name:'Classic Heat',icon:'♨',duration:15,capacity:16,price:45,cost:60,intensity:3,mood:'Focused',scent:'Birch',music:'None',tags:['traditional','heat'],appeal:{nerd:.18,purist:.15,local:.08},unlock:1,requiredMaster:35},
 {id:'forest',name:'Nordic Forest',icon:'✦',duration:20,capacity:18,price:65,cost:90,intensity:2,mood:'Grounded',scent:'Pine + cedar',music:'Ambient',tags:['wellness','ritual'],appeal:{wellness:.18,tourist:.1,local:.06},unlock:1,requiredMaster:40},
 {id:'social',name:'Social Steam',icon:'●',duration:20,capacity:20,price:55,cost:75,intensity:2,mood:'Social',scent:'Citrus',music:'Downtempo',tags:['social','accessible'],appeal:{crew:.22,tourist:.12,local:.08},unlock:1,requiredMaster:35},
 {id:'storm',name:'Ice Storm',icon:'✳',duration:18,capacity:16,price:85,cost:130,intensity:5,mood:'Extreme',scent:'Menthol',music:'Industrial',tags:['heat','extreme'],appeal:{nerd:.28,tourist:.1,purist:.08},unlock:3,requiredMaster:58},
 {id:'silent',name:'Silent Steam',icon:'◌',duration:25,capacity:14,price:80,cost:95,intensity:2,mood:'Quiet',scent:'Lavender',music:'Silence',tags:['quiet','wellness'],appeal:{purist:.3,wellness:.25},unlock:4,requiredMaster:52},
 {id:'soundbath',name:'Sound Bath Steam',icon:'◍',duration:30,capacity:18,price:105,cost:145,intensity:2,mood:'Immersive',scent:'Cedar',music:'Live bowls',tags:['wellness','ritual','premium'],appeal:{wellness:.28,tourist:.18},unlock:5,requiredMaster:68}
];

const TRENDS=[
 {id:'ritual',name:'Ritual Renaissance',days:4,desc:'Guided formats are hot.',demand:1.04,tags:{ritual:1.18}},
 {id:'quiet',name:'Quiet Luxury',days:4,desc:'Calm, comfort and premium recovery lead.',demand:1.01,tags:{quiet:1.22,wellness:1.08}},
 {id:'social',name:'Social Steam',days:4,desc:'Groups and afterwork traffic are peaking.',demand:1.08,tags:{social:1.18}},
 {id:'heat',name:'Hard Heat',days:4,desc:'Intense heat formats are trending.',demand:1.03,tags:{heat:1.18,extreme:1.12}},
 {id:'slow',name:'Slow Week',days:3,desc:'Demand is temporarily softer.',demand:.86,tags:{}},
 {id:'tourism',name:'City Break',days:5,desc:'Tourist traffic is elevated.',demand:1.06,guest:{tourist:1.5},tags:{premium:1.08}}
];

const LOTS=[
 {id:'valby',name:'Valby Bathhouse',city:'Copenhagen',country:'DK',price:0,rent:22000,demand:.88,size:7,unlock:1,competitor:.35,trait:'Neighborhood loyalty',mods:{local:1.25},accent:'#8eab83'},
 {id:'vesterbro',name:'Vesterbro Courtyard',city:'Copenhagen',country:'DK',price:42000,rent:36000,demand:1.12,size:8,unlock:2,competitor:.55,trait:'Social traffic',mods:{crew:1.35,tourist:1.1},accent:'#d78a62'},
 {id:'nordhavn',name:'Nordhavn Warehouse',city:'Copenhagen',country:'DK',price:56000,rent:32000,demand:1.0,size:10,unlock:2,competitor:.4,trait:'Room to scale',mods:{wellness:1.15},accent:'#78a6ad'},
 {id:'refshale',name:'Refshaleøen Boiler Hall',city:'Copenhagen',country:'DK',price:76000,rent:39000,demand:1.08,size:11,unlock:3,competitor:.48,trait:'Culture crowd',mods:{tourist:1.22,crew:1.15},accent:'#a294bf'},
 {id:'aarhus',name:'Aarhus Harbor Heat',city:'Aarhus',country:'DK',price:98000,rent:42000,demand:1.16,size:10,unlock:4,competitor:.5,trait:'Young growth',mods:{crew:1.25,local:1.12},accent:'#ca9f64'},
 {id:'odense',name:'Odense Garden Baths',city:'Odense',country:'DK',price:88000,rent:32000,demand:.98,size:11,unlock:4,competitor:.28,trait:'Wellness market',mods:{wellness:1.32,purist:1.12},accent:'#8bad7b'},
 {id:'aalborg',name:'Aalborg Steam Works',city:'Aalborg',country:'DK',price:110000,rent:35000,demand:1.03,size:12,unlock:5,competitor:.25,trait:'Low competition',mods:{local:1.2,nerd:1.12},accent:'#8ca0c6'},
 {id:'malmo',name:'Malmö Dock Sauna',city:'Malmö',country:'SE',price:145000,rent:48000,demand:1.22,size:12,unlock:6,competitor:.58,trait:'Nordic tourism',mods:{tourist:1.35,wellness:1.1},accent:'#be8b86'},
 {id:'berlin',name:'Berlin Heat Club',city:'Berlin',country:'DE',price:210000,rent:72000,demand:1.35,size:13,unlock:7,competitor:.68,trait:'Night culture',mods:{crew:1.35,nerd:1.2},accent:'#a58a72'},
 {id:'oslo',name:'Oslo Fjord Rituals',city:'Oslo',country:'NO',price:275000,rent:89000,demand:1.42,size:13,unlock:8,competitor:.62,trait:'Premium market',mods:{wellness:1.35,tourist:1.25},accent:'#7695a8'},
 {id:'helsinki',name:'Helsinki House',city:'Helsinki',country:'FI',price:340000,rent:92000,demand:1.48,size:14,unlock:9,competitor:.78,trait:'Expert audience',mods:{nerd:1.4,purist:1.3},accent:'#7c9690'},
 {id:'tokyo',name:'Tokyo Nordic Steam',city:'Tokyo',country:'JP',price:520000,rent:145000,demand:1.72,size:15,unlock:11,competitor:.72,trait:'Prestige market',mods:{tourist:1.4,wellness:1.3},accent:'#b57c83'}
];


const EXTRA_MARKETS=[
 ['stockholm','Stockholm Archipelago Heat','Stockholm','SE','Design-forward market',1.36,13,12,.64],['gothenburg','Gothenburg Harbor Steam','Gothenburg','SE','Harbor regulars',1.18,12,11,.42],['hamburg','Hamburg Speicher Sauna','Hamburg','DE','Waterfront culture',1.24,13,11,.55],['amsterdam','Amsterdam Canal Heat','Amsterdam','NL','Tourist-heavy premium',1.38,13,12,.66],['rotterdam','Rotterdam Steam Depot','Rotterdam','NL','Architecture crowd',1.23,14,12,.48],['brussels','Brussels Bath Club','Brussels','BE','International audience',1.19,12,12,.44],['paris','Paris Nordic Baths','Paris','FR','High-price prestige',1.48,14,14,.75],['london','London Steam Rooms','London','UK','Dense premium demand',1.52,14,14,.78],['edinburgh','Edinburgh Heat House','Edinburgh','UK','Cold-weather loyalty',1.22,12,13,.38],['dublin','Dublin Sauna Yard','Dublin','IE','Social market',1.27,13,13,.48],['vienna','Vienna Thermal Club','Vienna','AT','Wellness tradition',1.3,14,13,.53],['prague','Prague Boiler Rooms','Prague','CZ','Value-conscious tourism',1.18,13,13,.4],['warsaw','Warsaw Steam Works','Warsaw','PL','Fast growth',1.22,14,14,.43],['tallinn','Tallinn Nordic House','Tallinn','EE','Sauna-literate audience',1.31,14,14,.58],['riga','Riga Bathhouse','Riga','LV','Low-rent growth',1.12,13,13,.3],['vilnius','Vilnius Heat Lab','Vilnius','LT','Creative district',1.14,13,13,.32],['reykjavik','Reykjavik Steam Culture','Reykjavik','IS','Thermal expectations',1.42,15,15,.67],['zurich','Zurich Quiet Heat','Zurich','CH','Luxury wellness',1.5,14,15,.71],['milan','Milan Design Sauna','Milan','IT','Style-led premium',1.37,14,15,.63],['barcelona','Barcelona Sunset Steam','Barcelona','ES','Tourism and social',1.34,15,15,.62],['lisbon','Lisbon Heat Garden','Lisbon','PT','Outdoor recovery',1.28,15,15,.52],['newyork','Brooklyn Sauna Works','New York','US','Huge demand, huge rent',1.62,15,17,.82],['montreal','Montreal Winter Baths','Montreal','CA','Winter wellness',1.39,15,16,.56],['toronto','Toronto Nordic Club','Toronto','CA','Corporate wellness',1.42,15,17,.65],['vancouver','Vancouver Recovery House','Vancouver','CA','Wellness-first market',1.45,16,17,.64],['seattle','Seattle Steam Lab','Seattle','US','Tech and recovery',1.43,15,18,.61],['portland','Portland Bathing Co.','Portland','US','Independent culture',1.31,16,17,.48],['sanfrancisco','San Francisco Heat Club','San Francisco','US','High-spend market',1.58,16,19,.79],['losangeles','LA Recovery Sauna','Los Angeles','US','Wellness economy',1.55,16,19,.74],['seoul','Seoul Nordic Steam','Seoul','KR','Bathhouse competition',1.6,17,19,.84],['taipei','Taipei Heat Studio','Taipei','TW','Dense urban demand',1.46,16,18,.69],['singapore','Singapore Cold & Heat','Singapore','SG','Premium recovery',1.52,17,20,.76],['sydney','Sydney Harbor Sauna','Sydney','AU','Outdoor lifestyle',1.44,17,20,.59],['melbourne','Melbourne Steam Culture','Melbourne','AU','Culture and coffee crowd',1.41,17,20,.57],['auckland','Auckland Nordic Yard','Auckland','NZ','Compact premium market',1.28,16,19,.44],['kyoto','Kyoto Quiet Steam','Kyoto','JP','Quiet ritual prestige',1.49,15,21,.73]
];
EXTRA_MARKETS.forEach((x,i)=>LOTS.push({id:x[0],name:x[1],city:x[2],country:x[3],price:600000+i*42000,rent:110000+i*6500,demand:x[5],size:x[6],unlock:x[7],competitor:x[8],trait:x[4],mods:{tourist:i%3===0?1.2:1,wellness:i%4===0?1.2:1,nerd:i%5===0?1.15:1},accent:['#78958a','#9f846f','#778da0','#9b7e8d'][i%4]}));

const EVENTS=[
 {id:'boiler',title:'Boiler warning',body:'A heat exchanger is running rough.',minDay:3,weight:2,options:[{label:'Repair properly',cash:-4800,condition:10,rep:1},{label:'Patch it',cash:-1200,condition:-5,rep:-1}]},
 {id:'creator',title:'Creator visit',body:'A local culture creator asks for free access for a group.',minDay:2,weight:1.5,options:[{label:'Host the group',cash:-1800,rep:5,demandBoost:2},{label:'Decline politely',rep:0}]},
 {id:'inspection',title:'Hygiene inspection',body:'An unannounced inspection checks cleanliness and operations.',minDay:5,weight:1.2,dynamic:true},
 {id:'staff_offer',title:'Recruiter call',body:'A promising Goose Master is available today.',minDay:4,weight:1.3,options:[{label:'Hire specialist',specialHire:'master',cash:-4500},{label:'Pass'}]},
 {id:'energy',title:'Energy price spike',body:'Utility prices jump for the next three days.',minDay:6,weight:1.2,options:[{label:'Absorb the cost',utilityMod:1.15},{label:'Lower heat slightly',utilityMod:.95,rep:-2}]},
 {id:'corporate',title:'Private booking request',body:'A company wants an off-hours private session.',minDay:5,weight:1.1,options:[{label:'Take booking',cash:6500,rep:-1},{label:'Protect regulars',rep:2}]}
];

const OBJECTIVES=[
 {id:'first100',name:'First hundred guests',desc:'Serve 100 lifetime guests.',reward:5000,test:s=>totalGuests(s)>=100},
 {id:'rating4',name:'Four-star house',desc:'Reach 4.0 rating at one location.',reward:6500,test:s=>Object.values(s.locations).some(l=>l.rating>=4)},
 {id:'two',name:'Second address',desc:'Own two locations.',reward:8000,test:s=>s.ownedLots.length>=2},
 {id:'goosecraft',name:'Goose craft',desc:'Create a custom Sauna Goose.',reward:4000,test:s=>s.gooseLibrary.some(g=>g.custom)},
 {id:'thousand',name:'Steam for a thousand',desc:'Serve 1,000 lifetime guests.',reward:18000,test:s=>totalGuests(s)>=1000},
 {id:'network',name:'Regional operator',desc:'Own five locations.',reward:30000,test:s=>s.ownedLots.length>=5},
 {id:'beloved',name:'Beloved brand',desc:'Reach empire rating 4.5.',reward:25000,test:s=>empireRating(s)>=4.5}
];

const RANK_NAMES=['Nordhavn Heat','Sweat Society','Löyly House','Steam Bureau','Hot Culture','Kiuas Collective','Ritual Works','Bathing Office','Sauna Standard'];

function lotOf(loc){return LOTS.find(x=>x.id===loc.lotId)}
function makeStaff(role,r=Math.random){const names=['Asta','Noor','Mika','Freja','Otto','Sami','Alma','Elias','Liv','Jonas','Nora','Karla','Malik','Sigrid','Theo','Aya'];const traits=STAFF_TRAITS.filter(t=>t.roles.includes(role));return{id:uid('st'),name:pick(names,r),role,skill:Math.floor(42+r()*34),morale:Math.floor(75+r()*20),energy:100,xp:0,trait:pick(traits,r)?.id||null,wage:STAFF_ROLES[role].wage,active:true,sickDays:0}}
function makeLocation(lot){return{id:lot.id,name:lot.name,lotId:lot.id,open:false,entryPrice:145,hours:{open:9,close:22},membership:{enabled:false,price:299,members:0},merch:{enabled:false,price:180},marketing:0,marketingDays:0,tempDemandBoost:0,utilityMod:1,rooms:[],staff:[],schedule:[],reviews:[],history:[],guestHistory:[],guestStats:Object.fromEntries(GUEST_TYPES.map(g=>[g.id,{today:0,lifetime:0,satisfaction:0,visits:0}])),reputation:18,rating:3.65,cleanliness:92,condition:95,queue:0,occupancy:0,loyalty:8,day:{revenue:0,costs:0,profit:0,guests:0,walkaways:0,gooseRevenue:0,secondary:0,refunds:0},lifetime:{revenue:0,costs:0,profit:0,guests:0,gooseRuns:0,cancellations:0},flags:{understaffed:false,overcrowded:false},pricingHistory:[],auto:{pricing:false,maintenance:false,marketing:false}}}
function createState(seed=Date.now()%2147483647){const seeded=RNG(seed),lot=LOTS[0],loc=makeLocation(lot);loc.rooms=[{id:uid('r'),type:'reception',level:1,condition:100},{id:uid('r'),type:'sauna',level:1,condition:100},{id:uid('r'),type:'shower',level:1,condition:100},{id:uid('r'),type:'cold',level:1,condition:100},{id:uid('r'),type:'lounge',level:1,condition:100}];loc.staff=[makeStaff('host',seeded),makeStaff('cleaner',seeded),makeStaff('master',seeded)];loc.schedule=[{id:uid('sc'),gooseId:'classic',time:'10:00'},{id:uid('sc'),gooseId:'forest',time:'13:00'},{id:uid('sc'),gooseId:'social',time:'17:30'}];return migrateState({version:3,seed,brand:'Steamfolk',cash:52000,debt:0,creditLimit:60000,day:1,minute:9*60,speed:1,paused:true,gameOver:false,won:false,level:1,xp:0,prestige:0,selectedLot:'valby',ownedLots:['valby'],locations:{valby:loc},gooseLibrary:DEFAULT_GOOSE.map(g=>({...g,appeal:{...(g.appeal||{})}})),gooseStats:{},empireReviews:[],trend:{id:'ritual',daysLeft:4},pendingEvent:null,eventHistory:[],completedObjectives:[],notifications:[],rankings:[],negativeCashDays:0,settings:{sound:true,reducedMotion:false},lastDaily:null})}

function roomMetrics(loc){let m={capacity:0,saunaCap:0,receptionCap:0,showerCap:0,style:0,comfort:0,heat:0,ritual:0,wellness:0,social:0,flow:0,service:0,utility:0};for(const r of loc.rooms){const c=ROOM_CATALOG[r.type];if(!c)continue;const lv=r.level||1,cond=(r.condition??100)/100,scale=(1+.45*(lv-1))*cond;m.capacity+=c.baseCap*scale;if(['sauna','premium'].includes(r.type))m.saunaCap+=c.baseCap*scale;if(r.type==='reception')m.receptionCap+=c.baseCap*scale;if(r.type==='shower')m.showerCap+=c.baseCap*scale;m.style+=c.style*lv*cond;m.comfort+=c.comfort*lv*cond;m.heat+=c.heat*lv*cond;m.ritual+=c.ritual*lv*cond;m.wellness+=c.wellness*lv*cond;m.social+=c.social*lv*cond;m.flow+=c.flow*lv*cond;m.service+=c.service*lv*cond;m.utility+=c.utility*lv}return m}
function staffEffects(loc){let e={service:0,clean:0,goose:0,manage:0,secondary:0,utility:0,training:0,morale:0,heat:0};for(const st of loc.staff){if(!st.active||st.sickDays>0)continue;const eff=(st.skill/100)*(st.energy/100)*(st.morale/100);if(st.role==='host')e.service+=eff;if(st.role==='cleaner')e.clean+=eff;if(st.role==='master')e.goose+=eff;if(st.role==='manager')e.manage+=eff;const t=STAFF_TRAITS.find(x=>x.id===st.trait);if(t)for(const [k,v] of Object.entries(t.effect))e[k]=(e[k]||0)+v*eff}return e}
function hasCoreRooms(loc){return loc.rooms.some(r=>r.type==='reception')&&loc.rooms.some(r=>['sauna','premium'].includes(r.type))&&loc.rooms.some(r=>r.type==='shower')}
function requiredStaff(loc){const rooms=loc.rooms.reduce((o,r)=>{const c=ROOM_CATALOG[r.type];for(const [role,n] of Object.entries(c?.staff||{}))o[role]=(o[role]||0)+n;return o},{});return{host:Math.max(1,rooms.host||0),cleaner:Math.max(1,Math.ceil(loc.rooms.length/7)),master:loc.schedule.length?1:0,manager:loc.rooms.length>=9?1:0}}
function activeStaffCount(loc,role){return loc.staff.filter(s=>s.role===role&&s.active&&s.sickDays<=0).length}
function staffingStatus(loc){const req=requiredStaff(loc),out={};for(const role of Object.keys(req))out[role]={required:req[role],active:activeStaffCount(loc,role),ok:activeStaffCount(loc,role)>=req[role]};return out}
function empireRating(s){const ls=Object.values(s.locations);return ls.length?ls.reduce((a,l)=>a+l.rating,0)/ls.length:0}
function totalGuests(s){return Object.values(s.locations).reduce((a,l)=>a+l.lifetime.guests,0)}
function locationValue(loc){const lot=lotOf(loc);const asset=loc.rooms.reduce((sum,room)=>sum+(ROOM_CATALOG[room.type]?.cost||0)*(.5+.12*(room.level-1))*((room.condition??100)/100),0);const starterAssets=(ROOM_CATALOG.reception.cost+ROOM_CATALOG.sauna.cost+ROOM_CATALOG.shower.cost)*.5;const goodwill=Math.max(0,loc.reputation-18)*500+Math.max(0,loc.rating-3.65)*3500+Math.max(0,loc.loyalty-8)*300;return Math.round((lot.price||18000)+Math.max(0,asset-starterAssets)+goodwill)}
function empireValue(s){return Math.round(s.cash-s.debt+Object.values(s.locations).reduce((a,l)=>a+locationValue(l),0))}
function updateCredit(s){s.creditLimit=Math.max(40000,Math.round(empireValue(s)*.22));}
function trendObj(s){return TRENDS.find(t=>t.id===s.trend.id)||TRENDS[0]}
function segmentWeight(s,loc,g){const lot=lotOf(loc),trend=trendObj(s);return g.weight*(lot.mods?.[g.id]||1)*(trend.guest?.[g.id]||1)}
function targetSegmentMix(s,loc){const weights=GUEST_TYPES.map(g=>({id:g.id,w:segmentWeight(s,loc,g)})),sum=weights.reduce((a,x)=>a+x.w,0);return Object.fromEntries(weights.map(x=>[x.id,x.w/sum]))}
function priceFactor(loc,g){const willingness=145*g.price;const ratio=loc.entryPrice/willingness;return clamp(1.65-ratio*.75,.12,1.3)}
function marketFit(loc,g){const m=roomMetrics(loc);const norm={heat:clamp(m.heat/26,0,1),ritual:clamp(m.ritual/28,0,1),wellness:clamp(m.wellness/24,0,1),social:clamp(m.social/22,0,1),style:clamp(m.style/35,0,1),comfort:clamp(m.comfort/35,0,1),quiet:clamp((m.comfort+m.wellness-m.social*.25)/45,0,1)};let score=0,den=0;for(const [k,w] of Object.entries(g.prefs)){score+=norm[k]*w;den+=w}return clamp(score/den,.15,1.15)}
function calcDemand(s,loc){if(!loc.open||!hasCoreRooms(loc))return 0;const lot=lotOf(loc),tr=trendObj(s),e=staffEffects(loc),staff=staffingStatus(loc);const rating=.55+loc.rating*.14,rep=.65+loc.reputation*.006,market=1-lot.competitor*.18,marketing=1+loc.marketing*.07+loc.tempDemandBoost*.05,loyal=1+loc.loyalty*.004,service=1+e.service*.08;const understaff=Object.values(staff).some(x=>!x.ok)?.84:1;const facility=clamp((loc.cleanliness+loc.condition)/180,.5,1.12);return lot.demand*tr.demand*rating*rep*market*marketing*loyal*service*understaff*facility}
function flowCapacity(loc){if(activeStaffCount(loc,'host')===0)return 0;const m=roomMetrics(loc),e=staffEffects(loc);const reception=Math.max(4,m.receptionCap*(.55+e.service*.55)),sauna=Math.max(4,m.saunaCap),showers=Math.max(4,m.showerCap*1.3);return Math.floor(Math.min(reception,sauna*2.4,showers*2.2)+m.flow*.6)}
function gooseTrendFactor(s,g){const tags=trendObj(s).tags||{};let f=1;for(const t of g.tags||[])f*=tags[t]||1;return f}
function bestMaster(loc,goose){return loc.staff.filter(st=>st.role==='master'&&st.active&&st.sickDays<=0&&st.energy>=15).sort((a,b)=>b.skill-a.skill)[0]||null}
function gooseQuality(s,loc,g,master){if(!master)return 1.4;const e=staffEffects(loc),m=roomMetrics(loc);const skill=2.15+master.skill/45,room=clamp(m.ritual/45,0,.7),cond=(loc.cleanliness+loc.condition)/250;const difficulty=Math.max(0,(g.requiredMaster-master.skill)/35);return clamp(skill+room+cond+e.goose*.35-difficulty,1,5)}
function gooseAppeal(s,loc,g,guest){return clamp(1+(g.appeal?.[guest.id]||0)+(gooseTrendFactor(s,g)-1)+marketFit(loc,guest)*.1,.6,1.75)}
function runGoose(s,loc,sched,r=Math.random){
 const g=s.gooseLibrary.find(item=>item.id===sched.gooseId);
 if(!g||g.unlock>s.level)return{ok:false,reason:'locked'};
 const room=loc.rooms.find(item=>item.id===sched.roomId)||loc.rooms.find(item=>['sauna','premium'].includes(item.type));
 const sessionMinute=sched.time?toMinute(sched.time):s.minute;
 const availableMasters=loc.staff.filter(person=>person.role==='master'&&person.active&&person.sickDays<=0&&person.energy>=15&&!(loc.sessionHistory||[]).some(session=>session.ok&&session.day===s.day&&session.masterId===person.id&&session.minute<=sessionMinute&&session.minute+session.duration>sessionMinute)).sort((first,second)=>second.skill-first.skill);
 let master=sched.masterId?loc.staff.find(item=>item.id===sched.masterId):availableMasters[0];
 if(master&&(!master.active||master.sickDays>0||master.role!=='master'||master.energy<15))master=null;
 const minute=sched.time?Number(sched.time.slice(0,2))*60+Number(sched.time.slice(3)):s.minute;
 const collision=(loc.sessionHistory||[]).some(item=>item.day===s.day&&item.ok&&item.minute+item.duration>minute&&item.minute<=minute&&(item.masterId===master?.id||item.roomId===room?.id));
 const record={id:uid('session'),day:s.day,minute,duration:g.duration,gooseId:g.id,name:g.name,price:g.price,masterId:master?.id,roomId:room?.id};
 const remember=result=>{loc.sessionHistory=[{...record,...result},...(loc.sessionHistory||[])].slice(0,180);return{...result,goose:g,master}};
 if(!loc.open||!room||!hasCoreRooms(loc))return remember({ok:false,reason:'closed',seats:0,revenue:0});
 if(!master||collision){loc.lifetime.cancellations++;loc.reputation=clamp(loc.reputation-1.2,0,100);return remember({ok:false,reason:collision?'resource-busy':'no-master',seats:0,revenue:0})}
 const quality=gooseQuality(s,loc,g,master);
 let weightedDemand=0;
 for(const guest of GUEST_TYPES){
  const willingness=(40+g.duration*1.3+quality*5)*guest.price;
  const acceptance=Math.exp(-Math.pow(g.price/Math.max(1,willingness),2)*.7);
  weightedDemand+=segmentWeight(s,loc,guest)*gooseAppeal(s,loc,g,guest)*acceptance;
 }
 weightedDemand/=GUEST_TYPES.reduce((sum,guest)=>sum+segmentWeight(s,loc,guest),0);
 const capacity=Math.floor(ROOM_CATALOG[room.type].baseCap*(1+.45*(room.level-1))*(room.condition/100));
 const seats=clamp(Math.round(Math.min(g.capacity,capacity)*calcDemand(s,loc)*weightedDemand*(.8+r()*.55)),0,capacity);
 const cost=gooseCost(g),revenue=seats*g.price;
 loc.day.revenue+=revenue;loc.day.gooseRevenue+=revenue;loc.day.costs+=cost;loc.lifetime.gooseRuns++;
 master.energy=clamp(master.energy-5-g.intensity,0,100);master.xp+=5+seats*.1;
 const stats=s.gooseStats[g.id]||(s.gooseStats[g.id]={runs:0,seats:0,revenue:0,quality:0,reviews:0,rating:0});
 stats.quality=(stats.quality*stats.runs+quality)/(stats.runs+1);stats.runs++;stats.seats+=seats;stats.revenue+=revenue;
 if(seats>0&&r()<.65)addReview(s,loc,g,clamp(quality+(r()-.5)*1.1,1,5),null,r);
 return remember({ok:true,seats,quality,revenue,cost,profit:revenue-cost});
}
function reviewText(rating,reason,g,r=Math.random){const pos=['Excellent pacing and a confident team.','Beautiful atmosphere and a thoughtful flow.','One of the better sauna visits in the city.','The recovery spaces made the whole visit work.','Warm service without being overbearing.'];const mid=['Good overall, but a few details need attention.','A solid visit with room to improve.','Worth visiting, though the flow was uneven.'];const neg=['Too much waiting and not enough calm.','The experience felt less polished than the price suggested.','Cleanliness and flow need work.','I expected more consistency from the operation.'];let text=rating>=4?pick(pos,r):rating>=3?pick(mid,r):pick(neg,r);if(reason)text+=' '+reason;if(g)text+=' '+g.name+' '+(rating>=4?'was a highlight.':'did not fully land.');return text}
function addReview(s,loc,g,rating,reason=null,r=Math.random){const names=['Maja K.','N. Hansen','Leo','Sofie R.','Jonas P.','Anna','Kasper','Emil V.','Nora','Lina','Mads T.','Sara','Milo','Ane'];const rv={id:uid('rv'),day:s.day,locationId:loc.id,gooseId:g?.id||null,rating:Math.round(clamp(rating,1,5)),author:pick(names,r),text:reviewText(rating,reason,g,r)};loc.reviews.unshift(rv);loc.reviews=loc.reviews.slice(0,120);s.empireReviews.unshift(rv);s.empireReviews=s.empireReviews.slice(0,400);if(g){const st=s.gooseStats[g.id]||(s.gooseStats[g.id]={runs:0,seats:0,revenue:0,quality:0,reviews:0,rating:0});st.rating=(st.rating*st.reviews+rv.rating)/(st.reviews+1);st.reviews++}return rv}
function guestSatisfaction(s,loc,g){const m=roomMetrics(loc),e=staffEffects(loc),staff=staffingStatus(loc);let score=3.05+(loc.cleanliness-75)/55+(loc.condition-75)/70+m.comfort/70+m.style/100+e.service*.18-loc.queue/55;const understaff=Object.values(staff).filter(x=>!x.ok).length;score-=understaff*.22;if(g)score+=marketFit(loc,g)*.42;return clamp(score,1,5)}
function arrivalBlock(s,loc,minutes,r=Math.random){const demand=calcDemand(s,loc);if(!demand)return;const hour=s.minute/60;const dayCurve=hour<11?.55:hour<14?.85:hour<17?.72:hour<20?1.18:.78;const expected=demand*dayCurve*(minutes/15)*3.2;const arrivals=Math.max(0,Math.round(expected*(.7+r()*.65)));const cap=flowCapacity(loc);let capacityRemaining=Math.max(0,cap-Math.round(loc.occupancy*.28));let admitted=0,walk=0;const mix=targetSegmentMix(s,loc);for(let i=0;i<arrivals;i++){const guest=weighted(GUEST_TYPES,g=>mix[g.id]*priceFactor(loc,g)*marketFit(loc,g),r);const accepted=r()<priceFactor(loc,guest)*(.72+marketFit(loc,guest)*.28);if(!accepted){walk++;continue}if(capacityRemaining<=0){walk++;loc.queue++;continue}capacityRemaining--;admitted++;const secBase=(loc.rooms.some(x=>x.type==='bar')?24:0)+(loc.merch.enabled?loc.merch.price*.07:0);const traitBonus=staffEffects(loc).secondary;const secondary=secBase*guest.spend*(1+traitBonus);loc.day.revenue+=loc.entryPrice+secondary;loc.day.secondary+=secondary;loc.day.guests++;loc.lifetime.guests++;loc.guestStats[guest.id].today++;loc.guestStats[guest.id].lifetime++;loc.occupancy++;loc.cleanliness=clamp(loc.cleanliness-.13,25,100);const sat=guestSatisfaction(s,loc,guest);const gs=loc.guestStats[guest.id];gs.satisfaction=(gs.satisfaction*gs.visits+sat)/(gs.visits+1);gs.visits++;if(r()<.015*guest.review)addReview(s,loc,null,sat,null,r)}loc.day.walkaways+=walk;loc.queue=clamp(loc.queue-Math.max(1,Math.floor((roomMetrics(loc).flow+staffEffects(loc).service*8)*(minutes/15))),0,90);loc.occupancy=Math.max(0,loc.occupancy-Math.max(1,Math.floor(loc.occupancy*.12*(minutes/15))))}
function cleanBlock(loc,minutes){const e=staffEffects(loc),cleaners=activeStaffCount(loc,'cleaner');if(cleaners)loc.cleanliness=clamp(loc.cleanliness+(e.clean*1.8+cleaners*.45)*(minutes/15),0,100)}
function tickBlock(s,minutes=5,r=Math.random){if(s.paused||s.gameOver||s.pendingEvent)return[];const events=[],prev=s.minute;s.minute+=minutes*s.speed;for(const loc of Object.values(s.locations)){if(!loc.open)continue;arrivalBlock(s,loc,minutes*s.speed,r);cleanBlock(loc,minutes*s.speed);for(const sc of loc.schedule){const [h,m]=sc.time.split(':').map(Number),t=h*60+m;if((prev<t&&s.minute>=t)||(prev===540&&t===540)){const result=runGoose(s,loc,sc,r);events.push({type:'goose',locationId:loc.id,...result})}}for(const st of loc.staff){if(st.active&&st.sickDays<=0)st.energy=clamp(st.energy-.025*minutes*s.speed,0,100)}}if(s.minute>=22*60)endDay(s,events,r);return events}
function monthlyCost(loc){const wages=loc.staff.reduce((a,x)=>a+x.wage,0),rent=lotOf(loc).rent;return wages+rent}
function applyAutomation(s,loc){if(activeStaffCount(loc,'manager')<1)return;const prev=loc.history.at(-1);if(loc.auto.pricing&&prev){const walkRate=prev.guests+prev.walkaways?prev.walkaways/(prev.guests+prev.walkaways):0;if(walkRate>.22)loc.entryPrice=clamp(loc.entryPrice-5,70,280);else if(walkRate<.05&&prev.guests>45)loc.entryPrice=clamp(loc.entryPrice+5,70,280)}if(loc.auto.maintenance&&loc.condition<72&&s.cash>12000)repairLocation(s,loc);if(loc.auto.marketing&&loc.marketing===0&&loc.reputation<65&&s.cash>8000)launchMarketing(s,loc,'local')}
function endLocationDay(s,loc,r=Math.random){const m=roomMetrics(loc),e=staffEffects(loc),staff=staffingStatus(loc);const utilities=m.utility*(.9+loc.day.guests/80)*loc.utilityMod*Math.max(.7,1+e.utility);const rent=lotOf(loc).rent/30;const wages=loc.staff.reduce((a,x)=>a+x.wage,0)/30;const marketing=loc.marketing*180;const maintenance=Math.max(0,(100-loc.condition))*5+(loc.rooms.length*18);const memberIncome=loc.membership.enabled?loc.membership.members*loc.membership.price/30:0;loc.day.revenue+=memberIncome;loc.day.costs+=utilities+rent+wages+marketing+maintenance;loc.day.profit=loc.day.revenue-loc.day.costs;loc.lifetime.revenue+=loc.day.revenue;loc.lifetime.costs+=loc.day.costs;loc.lifetime.profit+=loc.day.profit;s.cash+=loc.day.profit;const walkPenalty=loc.day.guests?loc.day.walkaways/(loc.day.guests+loc.day.walkaways):0;const sat=guestSatisfaction(s,loc,null)-walkPenalty*.8;loc.rating=clamp(loc.rating*.9+sat*.1,1,5);loc.reputation=clamp(loc.reputation+(loc.rating-3.5)*.55+Math.sign(loc.day.profit)*.15-walkPenalty*.9,0,100);loc.loyalty=clamp(loc.loyalty+(sat-3.5)*.6+(loc.membership.enabled?.15:0),0,100);loc.condition=clamp(loc.condition-.28-loc.day.guests*.012,20,100);for(const room of loc.rooms)room.condition=clamp((room.condition??100)-.18-loc.day.guests*.003,25,100);if(loc.membership.enabled){const signups=Math.max(0,Math.floor((loc.day.guests/45)*(loc.rating/4)*(loc.loyalty/35)));loc.membership.members=clamp(loc.membership.members+signups-(r()<.08?Math.floor(loc.membership.members*.03):0),0,2000)}if(loc.day.guests&&r()<.5)addReview(s,loc,null,clamp(sat+(r()-.5)*.9,1,5),walkPenalty>.18?'The queues were noticeable.':null,r);loc.history.push({day:s.day,revenue:round(loc.day.revenue),costs:round(loc.day.costs),profit:round(loc.day.profit),guests:loc.day.guests,walkaways:loc.day.walkaways,rating:round(loc.rating,2),cleanliness:round(loc.cleanliness),condition:round(loc.condition)});loc.history=loc.history.slice(-90);loc.guestHistory.push({day:s.day,...Object.fromEntries(Object.entries(loc.guestStats).map(([id,x])=>[id,x.today]))});loc.guestHistory=loc.guestHistory.slice(-60);for(const gs of Object.values(loc.guestStats))gs.today=0;const over=Object.values(staff).some(x=>!x.ok);loc.flags.understaffed=over;for(const st of loc.staff){if(st.sickDays>0)st.sickDays--;const mgr=e.manage;st.energy=clamp(st.energy+45+mgr*15,0,100);st.morale=clamp(st.morale+(loc.day.profit>=0?1:-2)+mgr*2,25,100);const gain=3+(e.training*4);st.xp+=gain;if(st.xp>=100){st.xp-=100;st.skill=clamp(st.skill+1,1,100)}}loc.cleanliness=clamp(loc.cleanliness+5+e.clean*10,35,100);loc.marketing=Math.max(0,loc.marketing-(loc.marketingDays<=1?1:0));loc.marketingDays=Math.max(0,loc.marketingDays-1);loc.tempDemandBoost=Math.max(0,loc.tempDemandBoost-1);loc.utilityMod=loc.utilityMod===1?1:1+(loc.utilityMod-1)*.65;applyAutomation(s,loc);loc.pricingHistory.push({day:s.day,price:loc.entryPrice});loc.pricingHistory=loc.pricingHistory.slice(-60);loc.day={revenue:0,costs:0,profit:0,guests:0,walkaways:0,gooseRevenue:0,secondary:0,refunds:0};loc.queue=0;loc.occupancy=0}
function rollTrend(s,r=Math.random){const t=pick(TRENDS,r);s.trend={id:t.id,daysLeft:t.days}}
function maybeEvent(s,r=Math.random){if(s.pendingEvent||r()>.23)return null;const elig=EVENTS.filter(e=>s.day>=e.minDay);if(!elig.length)return null;const ev=weighted(elig,e=>e.weight,r);if(ev.dynamic&&ev.id==='inspection'){const l=Object.values(s.locations).sort((a,b)=>a.cleanliness-b.cleanliness)[0];const pass=l.cleanliness>=78&&l.condition>=65;return s.pendingEvent={id:uid('ev'),type:'inspection',title:'Hygiene inspection',body:`Inspectors visited ${l.name}. ${pass?'Standards were strong.':'They found operational issues.'}`,locationId:l.id,options:pass?[{label:'Acknowledge report',rep:3,cash:0}]:[{label:'Deep clean immediately',cash:-3500,cleanliness:25,rep:-1},{label:'Accept warning',rep:-5}]} }s.pendingEvent={id:uid('ev'),type:ev.id,title:ev.title,body:ev.body,options:ev.options.map(x=>({...x}))};return s.pendingEvent}
function resolveEvent(s,index){const ev=s.pendingEvent;if(!ev)return false;const op=ev.options[index];if(!op)return false;const loc=ev.locationId?s.locations[ev.locationId]:s.locations[s.selectedLot]||Object.values(s.locations)[0];if(op.cash)s.cash+=op.cash;if(op.rep&&loc)loc.reputation=clamp(loc.reputation+op.rep,0,100);if(op.condition&&loc)loc.condition=clamp(loc.condition+op.condition,0,100);if(op.cleanliness&&loc)loc.cleanliness=clamp(loc.cleanliness+op.cleanliness,0,100);if(op.demandBoost&&loc)loc.tempDemandBoost+=op.demandBoost;if(op.utilityMod&&loc)loc.utilityMod=op.utilityMod;if(op.specialHire&&loc){const st=makeStaff(op.specialHire,RNG(s.seed+s.day*97+loc.staff.length*17));st.skill=Math.max(st.skill,72);loc.staff.push(st)}s.eventHistory.unshift({day:s.day,title:ev.title,choice:op.label});s.eventHistory=s.eventHistory.slice(0,60);s.pendingEvent=null;return true}
function checkObjectives(s){const gained=[];for(const o of OBJECTIVES){if(!s.completedObjectives.includes(o.id)&&o.test(s)){s.completedObjectives.push(o.id);s.cash+=o.reward;s.xp+=35;gained.push(o)}}return gained}
function rankScore(s){return Math.round(empireValue(s)/1200+totalGuests(s)/25+empireRating(s)*55+s.ownedLots.length*50+s.prestige*20)}
function buildRankings(s,r=Math.random){const player={name:s.brand,score:rankScore(s),player:true};const others=RANK_NAMES.map((name,i)=>({name,score:Math.round(110+i*85+s.day*(2.5+i*.22)+(r()-.5)*55)}));return[...others,player].sort((a,b)=>b.score-a.score).map((x,i)=>({...x,rank:i+1}))}
function endDay(s,events=[],r=Math.random){for(const loc of Object.values(s.locations))endLocationDay(s,loc,r);if(s.debt>0){const interest=s.debt*.00055;s.cash-=interest}s.day++;s.minute=9*60;s.paused=true;s.xp+=25+s.ownedLots.length*8;while(s.xp>=s.level*100){s.xp-=s.level*100;s.level++;s.prestige++;events.push({type:'level',level:s.level})}s.trend.daysLeft--;if(s.trend.daysLeft<=0)rollTrend(s,r);updateCredit(s);const objectives=checkObjectives(s);for(const o of objectives)events.push({type:'objective',objective:o});s.rankings=buildRankings(s,r);if(s.cash<0)s.negativeCashDays++;else s.negativeCashDays=0;if(s.cash<-s.creditLimit||s.negativeCashDays>=5){s.gameOver=true;s.paused=true}if(!s.campaignComplete&&s.ownedLots.length>=8&&empireValue(s)>=1500000&&empireRating(s)>=4.25){s.won=true;s.paused=true}maybeEvent(s,r);s.lastDaily={day:s.day-1,cash:round(s.cash),debt:round(s.debt),value:empireValue(s),rating:round(empireRating(s),2),guests:totalGuests(s)};return events}

function buyLot(s,lotId){const lot=LOTS.find(x=>x.id===lotId);if(!lot||s.ownedLots.includes(lotId))return{ok:false,reason:'unavailable'};if(s.level<lot.unlock)return{ok:false,reason:'level',required:lot.unlock};if(expansionRequirement(s,lot))return{ok:false,reason:expansionRequirement(s,lot)};if(s.cash<lot.price)return{ok:false,reason:'cash'};s.cash-=lot.price;s.ownedLots.push(lotId);const loc=makeLocation(lot);loc.rooms=[{id:uid('r'),type:'reception',level:1,condition:100},{id:uid('r'),type:'sauna',level:1,condition:100},{id:uid('r'),type:'shower',level:1,condition:100}];s.locations[lotId]=loc;s.selectedLot=lotId;updateCredit(s);return{ok:true,location:loc}}
function sellLot(s,lotId){if(s.ownedLots.length<=1)return{ok:false,reason:'last'};const loc=s.locations[lotId];if(!loc)return{ok:false,reason:'missing'};const payout=Math.round(locationValue(loc)*.68);s.cash+=payout;delete s.locations[lotId];s.ownedLots=s.ownedLots.filter(id=>id!==lotId);if(s.selectedLot===lotId)s.selectedLot=s.ownedLots[0];updateCredit(s);return{ok:true,payout}}
function buildRoom(s,loc,type){const c=ROOM_CATALOG[type],lot=lotOf(loc);if(!c)return{ok:false,reason:'type'};if(c.unlock>s.level)return{ok:false,reason:'level'};if(loc.rooms.length>=lot.size)return{ok:false,reason:'slots'};if(s.cash<c.cost)return{ok:false,reason:'cash'};s.cash-=c.cost;loc.rooms.push({id:uid('r'),type,level:1,condition:100});return{ok:true}}
function upgradeRoom(s,loc,id){const room=loc.rooms.find(r=>r.id===id);if(!room||room.level>=3)return{ok:false,reason:'max'};const cost=Math.round(ROOM_CATALOG[room.type].cost*(.7+.4*room.level));if(s.cash<cost)return{ok:false,reason:'cash',cost};s.cash-=cost;room.level++;room.condition=100;return{ok:true,cost}}
function demolishRoom(s,loc,id){const i=loc.rooms.findIndex(r=>r.id===id);if(i<0)return{ok:false};const room=loc.rooms[i];if(['reception','sauna','shower'].includes(room.type)&&loc.rooms.filter(r=>r.type===room.type).length<=1)return{ok:false,reason:'core'};const refund=Math.round(ROOM_CATALOG[room.type].cost*.3*room.level*((room.condition??100)/100));s.cash+=refund;loc.rooms.splice(i,1);return{ok:true,refund}}
function repairRoom(s,loc,id){const room=loc.rooms.find(r=>r.id===id);if(!room)return{ok:false};const cost=Math.round((100-(room.condition??100))*ROOM_CATALOG[room.type].cost*.006);if(s.cash<cost)return{ok:false,reason:'cash',cost};s.cash-=cost;room.condition=100;loc.condition=clamp(loc.condition+2,0,100);return{ok:true,cost}}
function repairLocation(s,loc){const cost=Math.round((100-loc.condition)*150+loc.rooms.reduce((a,r)=>a+(100-(r.condition??100))*35,0));if(s.cash<cost)return{ok:false,cost};s.cash-=cost;loc.condition=100;loc.rooms.forEach(r=>r.condition=100);return{ok:true,cost}}
function hire(s,loc,role){const c=STAFF_ROLES[role];if(!c)return{ok:false};if(s.cash<c.hire)return{ok:false,reason:'cash'};s.cash-=c.hire;const st=makeStaff(role,RNG(s.seed+s.day*97+loc.staff.length*17));loc.staff.push(st);return{ok:true,staff:st}}
function fire(loc,id){const i=loc.staff.findIndex(s=>s.id===id);if(i<0)return{ok:false};const [st]=loc.staff.splice(i,1);return{ok:true,staff:st}}
function trainStaff(s,loc,id){const st=loc.staff.find(x=>x.id===id);if(!st)return{ok:false};const cost=1800+st.skill*35;if(s.cash<cost)return{ok:false,reason:'cash',cost};s.cash-=cost;st.skill=clamp(st.skill+4,1,100);st.morale=clamp(st.morale+4,0,100);return{ok:true,cost}}
function toggleStaff(loc,id){const st=loc.staff.find(x=>x.id===id);if(!st)return false;st.active=!st.active;return st.active}
function addGoose(s,data){
 const g=normalizeGoose({...data,id:uid('goose'),custom:true,unlock:1});
 s.gooseLibrary.push(g);return g;
}
function updateGoose(s,id,data){
 const index=s.gooseLibrary.findIndex(item=>item.id===id);if(index<0)return false;
 const previous=s.gooseLibrary[index],next=normalizeGoose({...previous,...data,id:previous.id,custom:previous.custom,unlock:previous.unlock});
 for(const loc of Object.values(s.locations)){
  const sessions=loc.schedule.map(item=>({...item}));
  for(const session of sessions){const format=session.gooseId===id?next:s.gooseLibrary.find(item=>item.id===session.gooseId);const start=toMinute(session.time);
   if(start+format.duration>1320)return false;
   if(sessions.some(other=>other.id!==session.id&&(other.roomId===session.roomId||other.masterId&&other.masterId===session.masterId)&&start<toMinute(other.time)+(other.gooseId===id?next:s.gooseLibrary.find(item=>item.id===other.gooseId)).duration&&start+format.duration>toMinute(other.time)))return false;
  }
 }
 s.gooseLibrary[index]=next;return true;
}
function deleteGoose(s,id){const g=s.gooseLibrary.find(x=>x.id===id);if(!g?.custom)return false;s.gooseLibrary=s.gooseLibrary.filter(x=>x.id!==id);for(const loc of Object.values(s.locations))loc.schedule=loc.schedule.filter(x=>x.gooseId!==id);delete s.gooseStats[id];return true}
function scheduleGoose(loc,gooseId,time,masterId=null,library=DEFAULT_GOOSE,roomId=null){
 const g=library.find(item=>item.id===gooseId),start=toMinute(time);
 if(!g||!Number.isFinite(start)||start<540||start+g.duration>1320)return{ok:false,reason:'hours'};
 if(masterId&&!loc.staff.some(item=>item.id===masterId&&item.role==='master'&&item.active&&item.sickDays<=0))return{ok:false,reason:'master'};
 const rooms=loc.rooms.filter(item=>['sauna','premium'].includes(item.type)&&(!roomId||item.id===roomId));
 const room=rooms.find(candidate=>!loc.schedule.some(session=>{
  const other=library.find(item=>item.id===session.gooseId),otherStart=toMinute(session.time);
  const overlaps=other&&start<otherStart+other.duration&&start+g.duration>otherStart;
  return overlaps&&((session.roomId||rooms[0]?.id)===candidate.id||masterId&&masterId===session.masterId);
 }));
 if(!room)return{ok:false,reason:'time'};
 loc.schedule.push({id:uid('sc'),gooseId,time,masterId,roomId:room.id});
 loc.schedule.sort((first,second)=>first.time.localeCompare(second.time));return{ok:true};
}
function removeSchedule(loc,id){loc.schedule=loc.schedule.filter(x=>x.id!==id)}
function launchMarketing(s,loc,tier){const tiers={local:{cost:1800,power:1,days:3},city:{cost:5200,power:2,days:4},brand:{cost:12000,power:4,days:5}},t=tiers[tier];if(!t)return{ok:false};if(s.cash<t.cost)return{ok:false,reason:'cash'};s.cash-=t.cost;loc.marketing=Math.max(loc.marketing,t.power);loc.marketingDays=Math.max(loc.marketingDays,t.days);return{ok:true,...t}}
function setMembership(loc,enabled,price=loc.membership.price){loc.membership.enabled=enabled;loc.membership.price=clamp(+price||299,99,799);if(enabled&&loc.membership.members===0)loc.membership.members=5}
function setMerch(loc,enabled,price=loc.merch.price){loc.merch.enabled=enabled;loc.merch.price=clamp(+price||180,50,600)}
function takeLoan(s,amount){amount=Number(amount);updateCredit(s);if(!Number.isFinite(amount)||amount<=0)return{ok:false,reason:'amount'};if(s.debt+amount>s.creditLimit)return{ok:false,reason:'limit',limit:s.creditLimit};s.cash+=amount;s.debt+=amount;return{ok:true}}
function repay(s,amount){if(!Number.isFinite(Number(amount))||Number(amount)<=0)return{ok:false};amount=Math.min(Number(amount),s.cash,s.debt);if(amount<=0)return{ok:false};s.cash-=amount;s.debt-=amount;updateCredit(s);return{ok:true,amount}}
function validate(state){
 const errors=[];
 try{
  if(!state||state.version!==3)return['version'];
  if(!Array.isArray(state.ownedLots)||!state.ownedLots.length)return['ownedLots'];
  if(!Number.isFinite(state.cash)||!Number.isFinite(state.debt)||state.debt<0)errors.push('finance');
  if(!Number.isFinite(state.day)||!Number.isFinite(state.minute)||!Number.isFinite(state.level))errors.push('clock');
  for(const id of state.ownedLots){
   const loc=state.locations[id],lot=LOTS.find(item=>item.id===id);if(!loc||!lot){errors.push('location');continue}
   if(loc.rooms.length>lot.size||loc.rating<1||loc.rating>5)errors.push('location bounds');
   if(loc.rooms.some(room=>!ROOM_CATALOG[room.type]||!Number.isFinite(room.condition)||room.level<1||room.level>3))errors.push('room');
   if(loc.staff.some(person=>!STAFF_ROLES[person.role]))errors.push('staff');
   if(loc.schedule.some(session=>!state.gooseLibrary.some(goose=>goose.id===session.gooseId)||!Number.isFinite(toMinute(session.time))))errors.push('schedule');
  }
  if(state.gooseLibrary.some(goose=>!Number.isFinite(goose.price)||goose.price<0||!Number.isFinite(goose.duration)))errors.push('goose');
 }catch(error){errors.push('structure')}
 return errors;
}
function snapshot(s){return JSON.parse(JSON.stringify(s))}
function save(s){try{s.lastSavedAt=Date.now();localStorage.setItem('saunaEmpireRebuild',JSON.stringify(s));return true}catch(error){return false}}
function load(){
 try{
  const raw=localStorage.getItem('saunaEmpireRebuild')||localStorage.getItem('saunaEmpireRC');
  if(!raw)return null;
  const state=migrateState(JSON.parse(raw));if(validate(state).length)return null;
  const now=Date.now(),hours=Math.min(8,Math.max(0,now-(state.lastSavedAt||now))/3600000);
  if(hours>.08&&!state.gameOver&&!state.pendingEvent){
   const daily=Object.values(state.locations).filter(loc=>loc.open).reduce((sum,loc)=>{const history=loc.history.slice(-5);return sum+(history.length?history.reduce((total,day)=>total+day.profit,0)/history.length:0)},0);
   const earned=Math.round(daily/13*hours*.35);state.cash+=earned;
   if(earned)state.offlineReport={hours:round(hours,1),earned};
  }
  state.lastSavedAt=now;state.paused=true;localStorage.setItem('saunaEmpireRebuild',JSON.stringify(state));return state;
 }catch(error){return null}
}


const AROMAS={birch:{name:'Birch',cost:12},pine:{name:'Pine',cost:14},citrus:{name:'Citrus',cost:10},lavender:{name:'Lavender',cost:16},cedar:{name:'Cedar',cost:18},menthol:{name:'Menthol',cost:22}};
const EQUIPMENT={classic:{name:'Classic towelwork',cost:8,skill:35},ritual:{name:'Quiet ritual',cost:12,skill:40},show:{name:'Choreographed show',cost:35,skill:65}};
function toMinute(value){if(typeof value!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(value))return NaN;return Number(value.slice(0,2))*60+Number(value.slice(3))}
function gooseCost(goose){const rounds=goose.rounds||[{aroma:'birch',delivery:'water'}];return Math.round(18+goose.duration*1.8+goose.intensity*7+rounds.reduce((sum,round)=>sum+(AROMAS[round.aroma]?.cost||12)*(round.delivery==='ice'?1.4:1),0)+(EQUIPMENT[goose.equipment]?.cost||8)+(goose.music==='Live bowls'?35:0))}
function normalizeGoose(data){
 const finite=(value,fallback)=>Number.isFinite(Number(value))?Number(value):fallback;
 const rounds=(Array.isArray(data.rounds)&&data.rounds.length?data.rounds:[{aroma:Object.keys(AROMAS).find(key=>String(data.scent).toLowerCase().includes(key))||'birch',delivery:'water'}]).slice(0,3).map(round=>({aroma:AROMAS[round.aroma]?round.aroma:'birch',delivery:round.delivery==='ice'?'ice':'water'}));
 const equipment=EQUIPMENT[data.equipment]?data.equipment:'classic';
 const goose={...data,name:String(data.name||'New Goose').trim().slice(0,60),icon:String(data.icon||'♨').slice(0,4),duration:clamp(finite(data.duration,20),10,60),capacity:clamp(finite(data.capacity,16),4,40),price:clamp(finite(data.price,60),0,1000000),intensity:clamp(finite(data.intensity,3),1,5),mood:String(data.mood||'Focused'),music:String(data.music||'Ambient'),tags:Array.isArray(data.tags)?data.tags.map(String).slice(0,8):String(data.tags||'ritual').split(',').map(tag=>tag.trim()).filter(Boolean).slice(0,8),appeal:data.appeal||{},rounds,equipment};
 goose.scent=rounds.map(round=>AROMAS[round.aroma].name).join(' → ');goose.requiredMaster=EQUIPMENT[equipment].skill+Math.max(0,goose.intensity-3)*5;goose.cost=gooseCost(goose);return goose;
}
function migrateState(state){
 if(!state||state.version!==3)throw Error('Unsupported save');
 state.gooseLibrary=state.gooseLibrary.map(normalizeGoose);
 state.selectedLot=state.ownedLots.includes(state.selectedLot)?state.selectedLot:state.ownedLots[0];
 if(!TRENDS.some(trend=>trend.id===state.trend?.id))state.trend={id:'ritual',daysLeft:4};
 state.rankings=state.rankings||[];state.eventHistory=state.eventHistory||[];
 for(const loc of Object.values(state.locations)){
  loc.sessionHistory=loc.sessionHistory||[];
  for(const session of loc.schedule)session.roomId=session.roomId||loc.rooms.find(room=>['sauna','premium'].includes(room.type))?.id;
 }
 return state;
}
function regionOf(lot){if(lot.country==='DK')return'denmark';if(['SE','NO','FI','IS'].includes(lot.country))return'nordic';if(['JP','US','CA','KR','TW','SG','AU','NZ'].includes(lot.country))return'world';return'europe'}
function expansionRequirement(state,lot){
 const required={denmark:0,nordic:2,europe:3,world:5}[regionOf(lot)];
 if(state.level<lot.unlock)return 'Reach level '+lot.unlock;
 if(state.ownedLots.length<required)return 'Operate '+required+' locations to establish this route';
 return '';
}
function tick(s,minutes=5,r=Math.random){
 if(!Number.isFinite(minutes)||minutes<=0)return[];
 const speed=s.speed;let remaining=Math.min(minutes*speed,780),events=[];s.speed=1;
 while(remaining>0&&!s.paused&&!s.pendingEvent&&!s.gameOver){const step=Math.min(5,remaining);events.push(...tickBlock(s,step,r));remaining-=step}
 s.speed=speed;return events;
}

const API={AROMAS,EQUIPMENT,gooseCost,normalizeGoose,migrateState,regionOf,expansionRequirement,ROOM_CATALOG,GUEST_TYPES,STAFF_ROLES,STAFF_TRAITS,DEFAULT_GOOSE,TRENDS,LOTS,EVENTS,OBJECTIVES,RNG,createState,makeLocation,makeStaff,roomMetrics,staffEffects,hasCoreRooms,requiredStaff,staffingStatus,empireRating,totalGuests,locationValue,empireValue,marketFit,targetSegmentMix,calcDemand,flowCapacity,gooseQuality,runGoose,addReview,guestSatisfaction,tick,endDay,checkObjectives,rankScore,buildRankings,buyLot,sellLot,buildRoom,upgradeRoom,demolishRoom,repairRoom,repairLocation,hire,fire,trainStaff,toggleStaff,addGoose,updateGoose,deleteGoose,scheduleGoose,removeSchedule,launchMarketing,applyAutomation,setMembership,setMerch,takeLoan,repay,resolveEvent,validate,snapshot,save,load,money,pct,clamp,round,monthlyCost};
if(typeof module!=='undefined'&&module.exports)module.exports=API;global.SaunaGameCore=API;
})(typeof globalThis!=='undefined'?globalThis:this);
