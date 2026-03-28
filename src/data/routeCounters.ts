export interface Terminal {
  id: string;
  name: string;
  shortName: string;
  location: string;
  district: string;
  phone: string;
  lat: number;
  lng: number;
  isMainTerminal: boolean;
}

export interface Counter {
  order: number;
  name: string;
  location: string;
  district: string;
  phone: string;
  type: 'Starting Point' | 'Counter' | 'Break (20 min)' | 'Last Stop';
  status: 'Active' | 'Unverified' | 'Unconfirmed';
}

export interface RouteData {
  id: string;
  from: string;
  to: string;
  counters: Counter[];
}

export const terminals: Terminal[] = [
  { id: 't1', name: 'Parshuram Counter', shortName: 'Parshuram', location: 'Parshuram, Feni', district: 'Feni', phone: '01973-259617', lat: 23.2042, lng: 91.3917, isMainTerminal: false },
  { id: 't2', name: 'Chhagalnaiya Counter', shortName: 'Chhagalnaiya', location: 'Chhagalnaiya, Feni', district: 'Feni', phone: '01973-259610', lat: 23.0417, lng: 91.5167, isMainTerminal: false },
  { id: 't3', name: 'Star Line Bus Main Terminal - Feni', shortName: 'Feni Terminal', location: 'Feni Bus Terminal, Feni', district: 'Feni', phone: '01973-259628', lat: 23.0105, lng: 91.3966, isMainTerminal: true },
  { id: 't4', name: 'Maniknagar Star Line Bus Terminal', shortName: 'Maniknagar Terminal', location: 'Maniknagar Bus Terminal, Dhaka', district: 'Dhaka', phone: '01973-259652', lat: 23.7275, lng: 90.4318, isMainTerminal: true },
  { id: 't5', name: 'Abdullahpur Star Line Bus Terminal', shortName: 'Abdullahpur Terminal', location: 'Abdullahpur Bus Stand, Dhaka', district: 'Dhaka', phone: '01973-259514', lat: 23.8728, lng: 90.3982, isMainTerminal: true },
  { id: 't6', name: 'Chittagong Star Line Bus Terminal', shortName: 'Chittagong Terminal', location: 'Boropol, Chittagong', district: 'Chittagong', phone: '01973-259681', lat: 22.3569, lng: 91.7832, isMainTerminal: true },
  { id: 't7', name: "Cox's Bazar Star Line Bus Terminal", shortName: "Cox's Bazar Terminal", location: "Sea Hill, Cox's Bazar", district: "Cox's Bazar", phone: '01973-259674', lat: 21.4272, lng: 92.0058, isMainTerminal: true },
  { id: 't8', name: 'Lakshmipur Star Line Bus Terminal', shortName: 'Lakshmipur Terminal', location: 'Lakshmipur Main Road', district: 'Lakshmipur', phone: '01973-250070', lat: 22.9453, lng: 90.8282, isMainTerminal: true },
];

export const routes: RouteData[] = [
  // Route 01: Feni → Dhaka (Abdullahpur) & reverse
  {
    id: 'rc01', from: 'Feni Terminal', to: 'Abdullahpur Terminal',
    counters: [
      { order: 1, name: 'Mohipal Main Counter', location: 'Mohipal Bus Stand', district: 'Feni', phone: '01973-259540', type: 'Starting Point', status: 'Active' },
      { order: 2, name: 'Mohipal Flyover Counter', location: 'Mohipal Flyover', district: 'Feni', phone: '01973-259640', type: 'Counter', status: 'Active' },
      { order: 3, name: 'Cheora Counter', location: 'Cheora Bazar', district: 'Cumilla', phone: '01973-259642', type: 'Counter', status: 'Active' },
      { order: 4, name: 'Chauddagram Counter', location: 'Chauddagram Bazar', district: 'Cumilla', phone: '01973-259612', type: 'Counter', status: 'Active' },
      { order: 5, name: 'Comilla Rest Stop', location: 'Comilla Rest Area', district: 'Cumilla', phone: '—', type: 'Break (20 min)', status: 'Active' },
      { order: 6, name: 'Kachpur Counter', location: 'Kachpur', district: 'Narayanganj', phone: '01687-480569', type: 'Counter', status: 'Active' },
      { order: 7, name: 'Chittagong Road Counter', location: 'Chittagong Road, Demra', district: 'Dhaka', phone: '01973-259654', type: 'Counter', status: 'Active' },
      { order: 8, name: 'Sayedabad Counter', location: 'Sayedabad', district: 'Dhaka', phone: '01973-259693', type: 'Counter', status: 'Active' },
      { order: 9, name: 'Maniknagar Counter', location: 'Maniknagar', district: 'Dhaka', phone: '01973-259652', type: 'Counter', status: 'Active' },
      { order: 10, name: 'TT Para Counter', location: 'TT Para', district: 'Dhaka', phone: '01973-259651', type: 'Counter', status: 'Active' },
      { order: 11, name: 'Mugda Counter', location: 'Mugda', district: 'Dhaka', phone: '01973-259503', type: 'Counter', status: 'Active' },
      { order: 12, name: 'Arambagh Counter', location: 'Arambagh', district: 'Dhaka', phone: '01973-259524', type: 'Counter', status: 'Active' },
      { order: 13, name: 'Fakirapool Counter', location: 'Fakirapool', district: 'Dhaka', phone: '01973-259525', type: 'Counter', status: 'Active' },
      { order: 14, name: 'Badda Counter', location: 'Madhya Badda', district: 'Dhaka', phone: '01973-259516', type: 'Counter', status: 'Active' },
      { order: 15, name: 'Banasree Counter', location: 'Banasree', district: 'Dhaka', phone: '01973-259548', type: 'Counter', status: 'Active' },
      { order: 16, name: 'Airport Counter', location: 'Airport, Kurmitola', district: 'Dhaka', phone: '01973-259512', type: 'Counter', status: 'Active' },
      { order: 17, name: 'Uttara Counter', location: 'Uttara', district: 'Dhaka', phone: '01973-259513', type: 'Counter', status: 'Active' },
      { order: 18, name: 'Abdullahpur Counter', location: 'Abdullahpur Bus Stand', district: 'Dhaka', phone: '01973-259514', type: 'Last Stop', status: 'Active' },
    ],
  },
  // Route 02: Feni Terminal → Maniknagar Terminal
  {
    id: 'rc02', from: 'Feni Terminal', to: 'Maniknagar Terminal',
    counters: [
      { order: 1, name: 'Feni Terminal', location: 'Feni Bus Terminal', district: 'Feni', phone: '01973-259628', type: 'Starting Point', status: 'Active' },
      { order: 2, name: 'Mohipal Main Counter', location: 'Mohipal Bus Stand', district: 'Feni', phone: '01973-259540', type: 'Counter', status: 'Active' },
      { order: 3, name: 'Mohipal Flyover Counter', location: 'Mohipal Flyover', district: 'Feni', phone: '01973-259640', type: 'Counter', status: 'Active' },
      { order: 4, name: 'Cheora Counter', location: 'Cheora Bazar', district: 'Cumilla', phone: '01973-259642', type: 'Counter', status: 'Active' },
      { order: 5, name: 'Chauddagram Counter', location: 'Chauddagram Bazar', district: 'Cumilla', phone: '01973-259612', type: 'Counter', status: 'Active' },
      { order: 6, name: 'Comilla Rest Stop', location: 'Comilla Rest Area', district: 'Cumilla', phone: '—', type: 'Break (20 min)', status: 'Active' },
      { order: 7, name: 'Kachpur Counter', location: 'Kachpur', district: 'Narayanganj', phone: '01687-480569', type: 'Counter', status: 'Active' },
      { order: 8, name: 'Chittagong Road Counter', location: 'Chittagong Road, Demra', district: 'Dhaka', phone: '01973-259654', type: 'Counter', status: 'Active' },
      { order: 9, name: 'Sayedabad Counter', location: 'Sayedabad', district: 'Dhaka', phone: '01973-259693', type: 'Counter', status: 'Active' },
      { order: 10, name: 'Maniknagar Main Terminal', location: 'Maniknagar Bus Terminal', district: 'Dhaka', phone: '01973-259652', type: 'Last Stop', status: 'Active' },
    ],
  },
  // Route 03: Parshuram → Maniknagar
  {
    id: 'rc03', from: 'Parshuram', to: 'Maniknagar Terminal',
    counters: [
      { order: 1, name: 'Parshuram Counter', location: 'Parshuram', district: 'Feni', phone: '01973-259617', type: 'Starting Point', status: 'Active' },
      { order: 2, name: 'Fulgazi Counter', location: 'Fulgazi', district: 'Feni', phone: '01973-259637', type: 'Counter', status: 'Active' },
      { order: 3, name: 'Feni Hospital Mor Counter', location: 'Feni Sadar Hospital Mor', district: 'Feni', phone: '01973-259639', type: 'Counter', status: 'Active' },
      { order: 4, name: 'Feni Terminal', location: 'Feni Bus Terminal', district: 'Feni', phone: '01973-259628', type: 'Counter', status: 'Active' },
      { order: 5, name: 'Cheora Counter', location: 'Cheora Bazar', district: 'Cumilla', phone: '01973-259642', type: 'Counter', status: 'Active' },
      { order: 6, name: 'Chauddagram Counter', location: 'Chauddagram Bazar', district: 'Cumilla', phone: '01973-259612', type: 'Counter', status: 'Active' },
      { order: 7, name: 'Comilla Rest Stop', location: 'Comilla Rest Area', district: 'Cumilla', phone: '—', type: 'Break (20 min)', status: 'Active' },
      { order: 8, name: 'Kachpur Counter', location: 'Kachpur', district: 'Narayanganj', phone: '01687-480569', type: 'Counter', status: 'Active' },
      { order: 9, name: 'Chittagong Road Counter', location: 'Chittagong Road, Demra', district: 'Dhaka', phone: '01973-259654', type: 'Counter', status: 'Active' },
      { order: 10, name: 'Sayedabad Counter', location: 'Sayedabad', district: 'Dhaka', phone: '01973-259693', type: 'Counter', status: 'Active' },
      { order: 11, name: 'Maniknagar Main Terminal', location: 'Maniknagar Bus Terminal', district: 'Dhaka', phone: '01973-259652', type: 'Last Stop', status: 'Active' },
    ],
  },
  // Route 04: Parshuram → Abdullahpur (1 Bus Only)
  {
    id: 'rc04', from: 'Parshuram', to: 'Abdullahpur Terminal',
    counters: [
      { order: 1, name: 'Parshuram Counter', location: 'Parshuram', district: 'Feni', phone: '01973-259617', type: 'Starting Point', status: 'Active' },
      { order: 2, name: 'Fulgazi Counter', location: 'Fulgazi', district: 'Feni', phone: '01973-259637', type: 'Counter', status: 'Active' },
      { order: 3, name: 'Feni Hospital Mor Counter', location: 'Feni Sadar Hospital Mor', district: 'Feni', phone: '01973-259639', type: 'Counter', status: 'Active' },
      { order: 4, name: 'Feni Terminal', location: 'Feni Bus Terminal', district: 'Feni', phone: '01973-259628', type: 'Counter', status: 'Active' },
      { order: 5, name: 'Cheora Counter', location: 'Cheora Bazar', district: 'Cumilla', phone: '01973-259642', type: 'Counter', status: 'Active' },
      { order: 6, name: 'Chauddagram Counter', location: 'Chauddagram Bazar', district: 'Cumilla', phone: '01973-259612', type: 'Counter', status: 'Active' },
      { order: 7, name: 'Comilla Rest Stop', location: 'Comilla Rest Area', district: 'Cumilla', phone: '—', type: 'Break (20 min)', status: 'Active' },
      { order: 8, name: 'Kachpur Counter', location: 'Kachpur', district: 'Narayanganj', phone: '01687-480569', type: 'Counter', status: 'Active' },
      { order: 9, name: 'Chittagong Road Counter', location: 'Chittagong Road, Demra', district: 'Dhaka', phone: '01973-259654', type: 'Counter', status: 'Active' },
      { order: 10, name: 'Sayedabad Counter', location: 'Sayedabad', district: 'Dhaka', phone: '01973-259693', type: 'Counter', status: 'Active' },
      { order: 11, name: 'Maniknagar Counter', location: 'Maniknagar', district: 'Dhaka', phone: '01973-259652', type: 'Counter', status: 'Active' },
      { order: 12, name: 'TT Para Counter', location: 'TT Para', district: 'Dhaka', phone: '01973-259651', type: 'Counter', status: 'Active' },
      { order: 13, name: 'Mugda Counter', location: 'Mugda', district: 'Dhaka', phone: '01973-259503', type: 'Counter', status: 'Active' },
      { order: 14, name: 'Arambagh Counter', location: 'Arambagh', district: 'Dhaka', phone: '01973-259524', type: 'Counter', status: 'Active' },
      { order: 15, name: 'Badda Counter', location: 'Madhya Badda', district: 'Dhaka', phone: '01973-259516', type: 'Counter', status: 'Active' },
      { order: 16, name: 'Airport Counter', location: 'Airport, Kurmitola', district: 'Dhaka', phone: '01973-259512', type: 'Counter', status: 'Active' },
      { order: 17, name: 'Uttara Counter', location: 'Uttara', district: 'Dhaka', phone: '01973-259513', type: 'Counter', status: 'Active' },
      { order: 18, name: 'Abdullahpur Counter', location: 'Abdullahpur Bus Stand', district: 'Dhaka', phone: '01973-259514', type: 'Last Stop', status: 'Active' },
    ],
  },
  // Route 05: Chhagalnaiya → Maniknagar
  {
    id: 'rc05', from: 'Chhagalnaiya', to: 'Maniknagar Terminal',
    counters: [
      { order: 1, name: 'Chhagalnaiya Counter', location: 'Chhagalnaiya', district: 'Feni', phone: '01973-259610', type: 'Starting Point', status: 'Active' },
      { order: 2, name: 'Feni Terminal', location: 'Feni Bus Terminal', district: 'Feni', phone: '01973-259628', type: 'Counter', status: 'Active' },
      { order: 3, name: 'Mohipal Main Counter', location: 'Mohipal Bus Stand', district: 'Feni', phone: '01973-259540', type: 'Counter', status: 'Active' },
      { order: 4, name: 'Cheora Counter', location: 'Cheora Bazar', district: 'Cumilla', phone: '01973-259642', type: 'Counter', status: 'Active' },
      { order: 5, name: 'Chauddagram Counter', location: 'Chauddagram Bazar', district: 'Cumilla', phone: '01973-259612', type: 'Counter', status: 'Active' },
      { order: 6, name: 'Comilla Rest Stop', location: 'Comilla Rest Area', district: 'Cumilla', phone: '—', type: 'Break (20 min)', status: 'Active' },
      { order: 7, name: 'Kachpur Counter', location: 'Kachpur', district: 'Narayanganj', phone: '01687-480569', type: 'Counter', status: 'Active' },
      { order: 8, name: 'Chittagong Road Counter', location: 'Chittagong Road, Demra', district: 'Dhaka', phone: '01973-259654', type: 'Counter', status: 'Active' },
      { order: 9, name: 'Sayedabad Counter', location: 'Sayedabad', district: 'Dhaka', phone: '01973-259693', type: 'Counter', status: 'Active' },
      { order: 10, name: 'Maniknagar Main Terminal', location: 'Maniknagar Bus Terminal', district: 'Dhaka', phone: '01973-259652', type: 'Last Stop', status: 'Active' },
    ],
  },
  // Route 06: Feni → Chittagong
  {
    id: 'rc06', from: 'Feni Terminal', to: 'Chittagong Terminal',
    counters: [
      { order: 1, name: 'Mohipal Counter (CTG Route)', location: 'Mohipal Bus Stand', district: 'Feni', phone: '01973-259644', type: 'Starting Point', status: 'Active' },
      { order: 2, name: 'Lalpul Counter', location: 'Lalpul, Chattogram Road', district: 'Feni', phone: '01973-259645', type: 'Counter', status: 'Active' },
      { order: 3, name: 'Koska Counter', location: 'Koska, Chattogram Road', district: 'Feni', phone: '01973-259611', type: 'Counter', status: 'Active' },
      { order: 4, name: 'Muhurigonj Counter', location: 'Muhurigonj', district: 'Feni', phone: '01973-259648', type: 'Counter', status: 'Active' },
      { order: 5, name: 'Chauddagram Counter', location: 'Chauddagram Bazar', district: 'Cumilla', phone: '01973-259612', type: 'Counter', status: 'Active' },
      { order: 6, name: 'Comilla Rest Stop', location: 'Comilla Rest Area', district: 'Cumilla', phone: '—', type: 'Break (20 min)', status: 'Active' },
      { order: 7, name: 'Vatiyari Counter', location: 'Vatiyari Point', district: 'Chittagong', phone: '01973-259684', type: 'Counter', status: 'Active' },
      { order: 8, name: 'AK Khan Counter', location: 'AK Khan Circle', district: 'Chittagong', phone: '01973-259535', type: 'Counter', status: 'Active' },
      { order: 9, name: 'Alankar Counter', location: 'Alankar Bus Stand', district: 'Chittagong', phone: '01973-259685', type: 'Counter', status: 'Active' },
      { order: 10, name: 'Boropol Counter', location: 'Boropol', district: 'Chittagong', phone: '01973-259681', type: 'Last Stop', status: 'Active' },
    ],
  },
  // Route 07: Feni → Cox's Bazar
  {
    id: 'rc07', from: 'Feni Terminal', to: "Cox's Bazar Terminal",
    counters: [
      { order: 1, name: "Mohipal Counter (Cox's Bazar)", location: 'Mohipal Bus Stand', district: 'Feni', phone: '01973-259510', type: 'Starting Point', status: 'Active' },
      { order: 2, name: 'Lalpul Counter', location: 'Lalpul, Chattogram Road', district: 'Feni', phone: '01973-259645', type: 'Counter', status: 'Active' },
      { order: 3, name: 'Koska Counter', location: 'Koska, Chattogram Road', district: 'Feni', phone: '01973-259611', type: 'Counter', status: 'Active' },
      { order: 4, name: 'Muhurigonj Counter', location: 'Muhurigonj', district: 'Feni', phone: '01973-259648', type: 'Counter', status: 'Active' },
      { order: 5, name: 'Chauddagram Counter', location: 'Chauddagram Bazar', district: 'Cumilla', phone: '01973-259612', type: 'Counter', status: 'Active' },
      { order: 6, name: 'Comilla Rest Stop', location: 'Comilla Rest Area', district: 'Cumilla', phone: '—', type: 'Break (20 min)', status: 'Active' },
      { order: 7, name: 'Vatiyari Counter', location: 'Vatiyari Point', district: 'Chittagong', phone: '01973-259684', type: 'Counter', status: 'Active' },
      { order: 8, name: 'AK Khan Counter', location: 'AK Khan Circle', district: 'Chittagong', phone: '01973-259535', type: 'Counter', status: 'Active' },
      { order: 9, name: 'Alankar Counter', location: 'Alankar Bus Stand', district: 'Chittagong', phone: '01973-259685', type: 'Counter', status: 'Active' },
      { order: 10, name: 'Boropol Counter', location: 'Boropol', district: 'Chittagong', phone: '01973-259681', type: 'Counter', status: 'Active' },
      { order: 11, name: 'Chakaria Counter', location: 'Chakaria', district: "Cox's Bazar", phone: '01973-259534', type: 'Counter', status: 'Active' },
      { order: 12, name: 'P. Jhinuk Market Counter', location: 'Puraton Jhinuk Market', district: "Cox's Bazar", phone: '01973-259671', type: 'Counter', status: 'Active' },
      { order: 13, name: 'Zia Guest House Counter', location: 'Zia Guest House Area', district: "Cox's Bazar", phone: '01973-259672', type: 'Counter', status: 'Active' },
      { order: 14, name: 'Central Terminal Counter', location: 'Central Bus Terminal', district: "Cox's Bazar", phone: '01973-259673', type: 'Counter', status: 'Active' },
      { order: 15, name: 'Sugandha Counter', location: 'Sugandha Point', district: "Cox's Bazar", phone: '01973-259687', type: 'Counter', status: 'Active' },
      { order: 16, name: 'Sea Hill Counter', location: 'Sea Hill', district: "Cox's Bazar", phone: '01973-259674', type: 'Last Stop', status: 'Active' },
    ],
  },
  // Route 08: Feni → Lakshmipur
  {
    id: 'rc08', from: 'Feni Terminal', to: 'Lakshmipur Terminal',
    counters: [
      { order: 1, name: 'Mohipal Counter (Lakshmipur)', location: 'Mohipal Bus Stand', district: 'Feni', phone: '—', type: 'Starting Point', status: 'Unverified' },
      { order: 2, name: 'Chilonia Counter', location: 'Chilonia', district: 'Feni', phone: '—', type: 'Counter', status: 'Unverified' },
      { order: 3, name: 'Dagonbhuiyan Counter', location: 'Dagonbhuiyan', district: 'Feni', phone: '—', type: 'Counter', status: 'Unverified' },
      { order: 4, name: 'Dagonboiwa Counter', location: 'Dagonboiwa', district: 'Noakhali', phone: '—', type: 'Counter', status: 'Unverified' },
      { order: 5, name: 'Chowmohoni Counter', location: 'Chowmohoni Town', district: 'Noakhali', phone: '—', type: 'Counter', status: 'Unverified' },
      { order: 6, name: 'Raipur Counter', location: 'Raipur', district: 'Lakshmipur', phone: '01973-250060', type: 'Counter', status: 'Active' },
      { order: 7, name: 'Alekjender Counter', location: 'Alekjender', district: 'Lakshmipur', phone: '01973-250067', type: 'Counter', status: 'Active' },
      { order: 8, name: 'Lakshmipur Counter', location: 'Lakshmipur Main Road', district: 'Lakshmipur', phone: '01973-250070', type: 'Last Stop', status: 'Active' },
    ],
  },
  // Route 09: Basurhat → Maniknagar (Unconfirmed)
  {
    id: 'rc09', from: 'Maniknagar Terminal', to: 'Basurhat / Dagonbhuiyan',
    counters: [
      { order: 1, name: 'Maniknagar Main Terminal', location: 'Maniknagar Bus Terminal', district: 'Dhaka', phone: '01973-259652', type: 'Starting Point', status: 'Active' },
      { order: 2, name: 'Sayedabad Counter', location: 'Sayedabad', district: 'Dhaka', phone: '01973-259693', type: 'Counter', status: 'Active' },
      { order: 3, name: 'Chittagong Road Counter', location: 'Chittagong Road, Demra', district: 'Dhaka', phone: '01973-259654', type: 'Counter', status: 'Active' },
      { order: 4, name: 'Kachpur Counter', location: 'Kachpur', district: 'Narayanganj', phone: '01687-480569', type: 'Counter', status: 'Active' },
      { order: 5, name: 'Comilla Rest Stop', location: 'Comilla Rest Area', district: 'Cumilla', phone: '—', type: 'Break (20 min)', status: 'Active' },
      { order: 6, name: 'Chauddagram Counter', location: 'Chauddagram Bazar', district: 'Cumilla', phone: '01973-259612', type: 'Counter', status: 'Active' },
      { order: 7, name: 'Cheora Counter', location: 'Cheora Bazar', district: 'Cumilla', phone: '01973-259642', type: 'Counter', status: 'Active' },
      { order: 8, name: 'Feni Area', location: 'Feni / Dagonbhuiyan', district: 'Feni', phone: '—', type: 'Counter', status: 'Unconfirmed' },
      { order: 9, name: 'Chowmohoni Counter', location: 'Chowmohoni Town', district: 'Noakhali', phone: '—', type: 'Counter', status: 'Unconfirmed' },
      { order: 10, name: 'Basurhat Counter', location: 'Basurhat', district: 'Noakhali', phone: '—', type: 'Last Stop', status: 'Unconfirmed' },
    ],
  },
];

// Map route labels to route data for the user-specified route list
export const routeConnections = [
  { from: 'Parshuram', to: 'Maniknagar Star Line Bus Terminal', routeId: 'rc03' },
  { from: 'Parshuram', to: 'Abdullahpur Star Line Bus Terminal', routeId: 'rc04' },
  { from: 'Parshuram', to: 'Chittagong Star Line Bus Terminal', routeId: null },
  { from: 'Chhagalnaiya', to: 'Maniknagar Star Line Bus Terminal', routeId: 'rc05' },
  { from: 'Chhagalnaiya', to: 'Abdullahpur Star Line Bus Terminal', routeId: null },
  { from: 'Chhagalnaiya', to: 'Chittagong Star Line Bus Terminal', routeId: null },
  { from: 'Star Line Bus Main Terminal - Feni', to: 'Maniknagar Star Line Bus Terminal', routeId: 'rc02' },
  { from: 'Star Line Bus Main Terminal - Feni', to: 'Abdullahpur Star Line Bus Terminal', routeId: 'rc01' },
  { from: 'Star Line Bus Main Terminal - Feni', to: 'Chittagong Star Line Bus Terminal', routeId: 'rc06' },
  { from: 'Star Line Bus Main Terminal - Feni', to: "Cox's Bazar Star Line Bus Terminal", routeId: 'rc07' },
  { from: 'Star Line Bus Main Terminal - Feni', to: 'Lakshmipur Star Line Bus Terminal', routeId: 'rc08' },
  { from: 'Maniknagar Star Line Bus Terminal', to: 'Parshuram', routeId: 'rc03' },
  { from: 'Maniknagar Star Line Bus Terminal', to: 'Chhagalnaiya', routeId: 'rc05' },
  { from: 'Maniknagar Star Line Bus Terminal', to: 'Star Line Bus Main Terminal - Feni', routeId: 'rc02' },
  { from: 'Maniknagar Star Line Bus Terminal', to: 'Basurhat / Dagonbhuiyan', routeId: 'rc09' },
  { from: 'Abdullahpur Star Line Bus Terminal', to: 'Star Line Bus Main Terminal - Feni', routeId: 'rc01' },
  { from: 'Chittagong Star Line Bus Terminal', to: 'Star Line Bus Main Terminal - Feni', routeId: 'rc06' },
  { from: 'Chittagong Star Line Bus Terminal', to: "Cox's Bazar Star Line Bus Terminal", routeId: 'rc07' },
  { from: "Cox's Bazar Star Line Bus Terminal", to: 'Star Line Bus Main Terminal - Feni', routeId: 'rc07' },
  { from: "Cox's Bazar Star Line Bus Terminal", to: 'Chittagong Star Line Bus Terminal', routeId: 'rc07' },
  { from: 'Lakshmipur Star Line Bus Terminal', to: 'Star Line Bus Main Terminal - Feni', routeId: 'rc08' },
];
