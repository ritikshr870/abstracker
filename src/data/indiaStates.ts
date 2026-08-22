export interface StateGroup {
  state: string;
  category: 'North' | 'South' | 'East' | 'West' | 'Central' | 'North East' | 'UT';
  cities: string[];
}

export const biharMajorCities = [
  'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif'
];

export const biharAllDistricts = [
  'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 
  'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 
  'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 
  'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 
  'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 
  'Supaul', 'Vaishali', 'West Champaran'
].sort();

export const biharOtherCities = [
  'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 
  'Danapur', 'Saharsa', 'Hajipur', 'Sasaram', 'Dehri', 'Siwan', 'Motihari', 
  'Nawada', 'Bagaha', 'Buxar', 'Kishanganj', 'Sitamarhi', 'Jamalpur', 
  'Jehanabad', 'Aurangabad', 'Bettiah', 'Madhubani', 'Samastipur', 'Banka',
  'Lakhisarai', 'Jamui', 'Gopalganj', 'Supaul', 'Araria', 'Madhepura'
].sort();

export const biharCities = Array.from(new Set([
  ...biharMajorCities,
  ...biharAllDistricts,
  ...biharOtherCities
])).sort();

export const popularMetroCities = [
  'Delhi NCR', 'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad', 
  'Ahmedabad', 'Pune', 'Jaipur', 'Lucknow', 'Patna', 'Surat', 'Kanpur', 
  'Nagpur', 'Indore', 'Bhopal', 'Chandigarh', 'Varanasi', 'Ranchi', 'Bhubaneswar',
  'Guwahati', 'Visakhapatnam', 'Kochi', 'Ludhiana', 'Agra', 'Dehradun', 'Raipur'
].sort();

export const allIndiaStateDetails: StateGroup[] = [
  {
    state: 'Bihar',
    category: 'East',
    cities: biharCities
  },
  {
    state: 'Delhi NCR',
    category: 'North',
    cities: [
      'New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi',
      'Noida', 'Greater Noida', 'Gurugram', 'Faridabad', 'Ghaziabad', 'Sonipat', 'Bahadurgarh'
    ].sort()
  },
  {
    state: 'Uttar Pradesh',
    category: 'North',
    cities: [
      'Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Noida', 'Greater Noida', 'Ghaziabad',
      'Meerut', 'Aligarh', 'Bareilly', 'Moradabad', 'Gorakhpur', 'Saharanpur', 'Jhansi', 
      'Muzaffarnagar', 'Mathura', 'Ayodhya', 'Firozabad', 'Faizabad', 'Rampur', 'Shahjahanpur', 
      'Farrukhabad', 'Hapur', 'Etawah', 'Mirzapur', 'Bulandshahr', 'Sambhal', 'Amroha', 
      'Hardoi', 'Fatehpur', 'Raebareli', 'Orai', 'Sitapur', 'Bahraich', 'Unnao', 'Jaunpur', 'Basti'
    ].sort()
  },
  {
    state: 'Maharashtra',
    category: 'West',
    cities: [
      'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Kalyan-Dombivli', 'Vasai-Virar', 
      'Chhatrapati Sambhaji Nagar', 'Navi Mumbai', 'Solapur', 'Mira-Bhayandar', 'Bhiwandi', 
      'Amravati', 'Nanded', 'Kolhapur', 'Akola', 'Ulhasnagar', 'Sangli', 'Malegaon', 
      'Jalgaon', 'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur', 'Parbhani', 'Jalna', 
      'Satara', 'Beed', 'Yavatmal', 'Gondia', 'Ratnagiri', 'Sindhudurg'
    ].sort()
  },
  {
    state: 'Gujarat',
    category: 'West',
    cities: [
      'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 
      'Gandhinagar', 'Anand', 'Navsari', 'Morbi', 'Nadiad', 'Surendranagar', 'Bharuch', 
      'Mehsana', 'Bhuj', 'Porbandar', 'Vapi', 'Valsad', 'Godhra', 'Patan', 'Palanpur', 'Veraval'
    ].sort()
  },
  {
    state: 'Rajasthan',
    category: 'North',
    cities: [
      'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 
      'Bharatpur', 'Sikar', 'Pali', 'Sri Ganganagar', 'Hanumangarh', 'Beawar', 'Jhunjhunu', 
      'Tonk', 'Kishangarh', 'Churu', 'Banswara', 'Barmer', 'Nagaur', 'Dholpur', 'Chittorgarh'
    ].sort()
  },
  {
    state: 'Madhya Pradesh',
    category: 'Central',
    cities: [
      'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 
      'Ratlam', 'Rewa', 'Katni', 'Singrauli', 'Burhanpur', 'Khandwa', 'Bhind', 
      'Chhindwara', 'Guna', 'Shivpuri', 'Vidisha', 'Damoh', 'Mandsaur', 'Khargone', 'Neemuch'
    ].sort()
  },
  {
    state: 'Karnataka',
    category: 'South',
    cities: [
      'Bengaluru', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru', 'Belagavi', 'Kalaburagi', 
      'Davanagere', 'Ballari', 'Vijayapura', 'Shivamogga', 'Tumakuru', 'Raichur', 
      'Bidar', 'Hosapete', 'Gadag', 'Hassan', 'Udupi', 'Robertsonpet', 'Bhadravati', 
      'Chitradurga', 'Kolar', 'Mandya', 'Chikkamagaluru'
    ].sort()
  },
  {
    state: 'Tamil Nadu',
    category: 'South',
    cities: [
      'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tiruppur', 'Erode', 
      'Tirunelveli', 'Vellore', 'Thoothukudi', 'Dindigul', 'Thanjavur', 'Ranipet', 'Sivakasi', 
      'Karur', 'Ooty', 'Hosur', 'Nagercoil', 'Kanchipuram', 'Cuddalore', 'Kumbakonam', 'Tiruvannamalai'
    ].sort()
  },
  {
    state: 'West Bengal',
    category: 'East',
    cities: [
      'Kolkata', 'Howrah', 'Siliguri', 'Durgapur', 'Asansol', 'Bardhaman', 'Malda', 
      'Baharampur', 'Habra', 'Kharagpur', 'Shantipur', 'Dankuni', 'Haldia', 'Raiganj', 
      'Krishnanagar', 'Midnapore', 'Jalpaiguri', 'Balurghat', 'Bankura', 'Darjeeling', 'Purulia', 'Cooch Behar'
    ].sort()
  },
  
  {
    state: 'Andhra Pradesh',
    category: 'South',
    cities: [
      'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Kakinada', 
      'Rajamahendravaram', 'Kadapa', 'Tirupati', 'Anantapur', 'Vizianagaram', 'Eluru', 
      'Ongole', 'Nandyal', 'Machilipatnam', 'Adoni', 'Tenali', 'Proddatur', 'Chittoor', 'Srikakulam'
    ].sort()
  },
  {
    state: 'Haryana',
    category: 'North',
    cities: [
      'Faridabad', 'Gurugram', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 
      'Karnal', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa', 'Bahadurgarh', 'Jind', 
      'Thanesar', 'Kaithal', 'Rewari', 'Palwal', 'Hansi'
    ].sort()
  },
  {
    state: 'Punjab',
    category: 'North',
    cities: [
      'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Hoshiarpur', 
      'Batala', 'Pathankot', 'Moga', 'Abohar', 'Malerkotla', 'Khanna', 'Phagwara', 
      'Muktsar', 'Barnala', 'Firozpur', 'Kapurthala'
    ].sort()
  },
  {
    state: 'Jharkhand',
    category: 'East',
    cities: [
      'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro Steel City', 'Deoghar', 'Phusro', 
      'Hazaribagh', 'Giridih', 'Ramgarh', 'Medininagar', 'Chirkunda', 'Chaibasa', 'Dumka', 'Sahibganj'
    ].sort()
  },
  {
    state: 'Kerala',
    category: 'South',
    cities: [
      'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Kollam', 'Thrissur', 'Kannur', 
      'Alappuzha', 'Kottayam', 'Palakkad', 'Manjeri', 'Thalassery', 'Kanhangad', 'Kasaragod', 'Malappuram'
    ].sort()
  },
  {
    state: 'Odisha',
    category: 'East',
    cities: [
      'Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 
      'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda', 'Jeypore', 'Bargarh', 'Rayagada', 'Bolangir', 'Angul'
    ].sort()
  },
  {
    state: 'Chhattisgarh',
    category: 'Central',
    cities: [
      'Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 
      'Raigarh', 'Jagdalpur', 'Ambikapur', 'Dhamtari', 'Mahasamund', 'Bhatapara'
    ].sort()
  },
  {
    state: 'Assam',
    category: 'North East',
    cities: [
      'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 
      'Tezpur', 'Bongaigaon', 'Dhubri', 'Diphu', 'North Lakhimpur', 'Karimganj', 'Sivasagar'
    ].sort()
  },
  
  
  
  {
    state: 'Goa',
    category: 'West',
    cities: [
      'Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim', 'Curchorem'
    ].sort()
  },
  
  {
    state: 'Meghalaya',
    category: 'North East',
    cities: ['Shillong', 'Tura', 'Jowai', 'Nongpoh', 'Williamnagar'].sort()
  },
  {
    state: 'Manipur',
    category: 'North East',
    cities: ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Ukhrul'].sort()
  },
  
  
  {
    state: 'Arunachal Pradesh',
    category: 'North East',
    cities: ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Tezu'].sort()
  },
  
  {
    state: 'Chandigarh',
    category: 'UT',
    cities: ['Chandigarh', 'Zirakpur', 'Panchkula', 'Mohali'].sort()
  },
  
  {
    state: 'Ladakh',
    category: 'UT',
    cities: ['Leh', 'Kargil'].sort()
  },
  
  ];

export const popularStates = [
  'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 
  'Uttar Pradesh', 'West Bengal', 'Rajasthan', 'Madhya Pradesh', 
  'Haryana', 'Andhra Pradesh', 'Kerala', 'Punjab', 'Odisha',
  'Jharkhand', 'Chhattisgarh', 'Assam', 'Bihar', 'Goa'
].sort();

export const statesAndUTs = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Chandigarh', 'Delhi',
  'Goa', 'Gujarat', 'Haryana', 'Jharkhand', 'Karnataka',
  'Kerala', 'Ladakh', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Uttar Pradesh', 'West Bengal'
].sort();

export const allUniqueCities = Array.from(
  new Set(allIndiaStateDetails.flatMap(s => s.cities))
).sort();

export const indiaStates = [
  ...statesAndUTs,
  ...allUniqueCities
];
