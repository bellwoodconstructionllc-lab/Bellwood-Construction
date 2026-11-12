/* ==========================================================================
   BELLWOOD CONSTRUCTION LLC — SITE CONFIG
   ==========================================================================
   EVERYTHING YOU WILL EVER NEED TO EDIT LIVES IN THIS FILE.
   Change a value here and it updates everywhere on the site.

   Anything written as [LIKE THIS] is a placeholder that still needs your
   real information. Search this file for "[" to find them all at once.
   ========================================================================== */

const BELLWOOD = {

  /* ------------------------------------------------------------------
     1. BUSINESS DETAILS
     ------------------------------------------------------------------ */
  business: {
    name: 'Bellwood Construction',          // shown in the header wordmark
    legalName: 'Bellwood Construction LLC', // used in the footer + SEO schema

    phone: '(425) 697-0732',
    phoneHref: 'tel:+14256970732',

    email: 'BellwoodConstructionLLC@gmail.com',
    emailHref: 'mailto:BellwoodConstructionLLC@gmail.com',

    city: 'Everett',
    state: 'WA',
    region: 'Snohomish County',

    // ---- STILL TO FILL IN -------------------------------------------
    streetAddress: '[STREET ADDRESS]',      // e.g. '1234 Rucker Ave, Suite 200'
    postalCode: '[ZIP]',                    // e.g. '98201'
    // Not displayed anywhere at the moment — the "Licensed & Insured"
    // panel, the Contact row and the footer line were all taken off.
    // Washington requires a registered contractor's number in advertising,
    // so this should go back on the site once you have it.
    licenseNumber: '[WA LICENSE #]',        // e.g. 'BELLWCL782KQ'
    // The headline figure in the trust strip under the hero.
    // `label` is the small line underneath, so the claim stays precise —
    // "combined experience" is the crew's total, not the company's age.
    experience: {
      value: '8',
      unit: 'years',
      label: 'Combined experience'
    },

    // Business hours. Leave `closed: true` for days you don't work.
    // These are DISPLAY hours for the Contact section. The booking
    // calendar has its own rules further down (section 6).
    hours: [
      { day: 'Monday',    open: '7:00 AM', close: '6:00 PM', closed: false },
      { day: 'Tuesday',   open: '7:00 AM', close: '6:00 PM', closed: false },
      { day: 'Wednesday', open: '7:00 AM', close: '6:00 PM', closed: false },
      { day: 'Thursday',  open: '7:00 AM', close: '6:00 PM', closed: false },
      { day: 'Friday',    open: '7:00 AM', close: '6:00 PM', closed: false },
      { day: 'Saturday',  open: '9:00 AM', close: '3:00 PM', closed: false },
      { day: 'Sunday',    open: '',        close: '',        closed: true  }
    ],

    // Social links. Leave a url as '' and that icon is hidden automatically.
    social: [
      { label: 'Facebook',  url: '' },   // e.g. 'https://facebook.com/...'
      { label: 'Instagram', url: '' },
      { label: 'Google',    url: '' }    // your Google Business Profile
    ],

    // Used for Open Graph / canonical tags once you have a domain.
    siteUrl: '[https://yourdomain.com]'
  },


  /* ------------------------------------------------------------------
     2. FORM ENDPOINTS
     ------------------------------------------------------------------
     All three forms email you at the address above once an endpoint is set.

     Easiest option — Formspree (formspree.io):
       1. Create a free account, verify BellwoodConstructionLLC@gmail.com
       2. Make a form, copy its endpoint, paste it below
       3. It looks like: 'https://formspree.io/f/abcdwxyz'

     If you host on Netlify you can use Netlify Forms instead — see README.

     UNTIL AN ENDPOINT IS SET the forms still work, but instead of sending
     they hand the visitor a pre-filled email button so nothing is lost.
     ------------------------------------------------------------------ */
  forms: {
    quoteEndpoint:   'https://formspree.io/f/xaeoyloq',   // Quote Request form
    bookingEndpoint: 'https://formspree.io/f/xaeoyloq',   // Book a Visit form
    contactEndpoint: 'https://formspree.io/f/xaeoyloq'    // Contact section's short form
  },


  /* ------------------------------------------------------------------
     3. OUR WORK — REAL BELLWOOD PROJECT PHOTOS
     ------------------------------------------------------------------
     These are the only photos that appear in the Our Work gallery.
     Order here = order on the page. Add or reorder freely.

       file     — filename inside assets/projects/
       category — 'Kitchens' or 'Bathrooms' (drives the filter chips)
       caption  — shown under the photo and in the lightbox
       alt      — description for screen readers and search engines
       before   — OPTIONAL. Add a "before" filename here and this item
                  automatically becomes a draggable before/after slider.
                  Leave as '' for a normal photo.

     Never put homeowner names, addresses or neighborhoods in a caption.
     ------------------------------------------------------------------ */
  projects: [
    {
      file: 'kitchen-two-tone-open-plan.jpg',
      category: 'Kitchens',
      caption: 'Open-concept kitchen: two-tone shaker cabinets, glass mosaic backsplash, quartz counters',
      alt: 'Remodeled open-plan kitchen with white upper cabinets, grey lower cabinets, a glass mosaic tile backsplash, light quartz countertops and wide plank wood-look flooring running through to the living area.',
      before: ''
    },
    {
      file: 'primary-bath-corner-tub.jpg',
      category: 'Bathrooms',
      caption: 'Primary bath: corner tub, frameless glass shower, matte black fixtures',
      alt: 'Primary bathroom remodel with a built-in corner soaking tub, a frameless glass shower with tiled walls, matte black fixtures, a long quartz-topped vanity and large format tile flooring.',
      before: ''
    },
    {
      file: 'half-bath-wood-vanity.jpg',
      category: 'Bathrooms',
      caption: 'Half bath: custom wood vanity, veined quartz top, marble-look porcelain floor',
      alt: 'Half bathroom with a natural wood shaker vanity, a veined quartz countertop, a black framed mirror, a chrome faucet and glossy marble-look porcelain tile flooring.',
      before: ''
    },
    {
      file: 'kitchen-maple-shaker.jpg',
      category: 'Kitchens',
      caption: 'Kitchen remodel: maple shaker cabinets and veined quartz counters',
      alt: 'Kitchen remodel with warm maple shaker cabinets, veined white quartz countertops wrapping a peninsula, a window above the sink and dark hardwood-look flooring.',
      before: ''
    },
    {
      file: 'bath-subway-tile-tub.jpg',
      category: 'Bathrooms',
      caption: 'Bath refresh: classic subway tile tub surround, marble-look floor, black hardware',
      alt: 'Refreshed bathroom with a white subway tile tub surround set around a window, a white shaker vanity with a stone top, black hardware, floating wood shelves and marble-look tile flooring.',
      before: ''
    },
    {
      file: 'shower-large-format-stone-tile.jpg',
      category: 'Bathrooms',
      caption: 'Walk-in shower: large-format stone-look porcelain with hex mosaic floor',
      alt: 'Walk-in shower finished in dramatic large-format dark stone-look porcelain panels with a recessed niche, a built-in bench and a white hexagon mosaic tile shower floor.',
      before: ''
    },
    {
      file: 'kitchen-island-hardwood.jpg',
      category: 'Kitchens',
      caption: 'Kitchen with island, shaker cabinets, and refinished hardwood floors',
      alt: 'Spacious kitchen with cream shaker cabinets, a large center island with a gas cooktop and stainless range hood, double wall ovens and refinished red oak hardwood floors.',
      before: ''
    }
  ],

  // Friendly note printed under the gallery.
  galleryNote: 'More projects added regularly. Ask us for photos of work like yours.',


  /* ------------------------------------------------------------------
     4. PLACEHOLDER IMAGES — TEMPORARY
     ------------------------------------------------------------------
     These are free-to-use photos standing in for shots you don't have yet.
     Every one is marked `placeholder: true`. They are used ONLY in the
     hero, the Process section and the Service Area banner — never in
     the Our Work gallery. (`wholeHome` is unused while that service is
     off the site; it's kept here so putting the card back is one step.)

     TO SWAP IN YOUR OWN PHOTO: drop the file in assets/placeholders/ and
     change `url` to 'assets/placeholders/your-file.jpg', then set
     placeholder: false.
     ------------------------------------------------------------------ */
  placeholderImages: {
    hero: {
      placeholder: true,
      url: 'https://images.unsplash.com/photo-1618832515490-e181c4794a45?q=80&w=2000&auto=format&fit=crop',
      urlSmall: 'https://images.unsplash.com/photo-1618832515490-e181c4794a45?q=80&w=1000&auto=format&fit=crop',
      alt: 'A kitchen mid-remodel, cabinets masked off and a step ladder standing in daylight from a large window.',
      credit: 'Photo via Unsplash',
      source: 'https://unsplash.com/photos/kitchen-renovation-with-white-cabinets-UqNEbyRQ660',
      license: 'Unsplash License — free for commercial use'
    },
    wholeHome: {
      placeholder: true,
      url: 'https://images.unsplash.com/photo-1777106322601-578dc9213ace?q=80&w=1200&auto=format&fit=crop',
      alt: 'A two-storey house exterior with clean trim and a dark garage door.',
      credit: 'Photo via Unsplash',
      source: 'https://unsplash.com/photos/modern-two-story-house-with-a-dark-garage-door-HckCpdBDeDk',
      license: 'Unsplash License — free for commercial use'
    },
    process: {
      placeholder: true,
      url: 'https://images.unsplash.com/photo-1599619585752-c3edb42a414c?q=80&w=1400&auto=format&fit=crop',
      alt: 'A paint roller resting in a tray of fresh white paint on a wood floor.',
      credit: 'Photo via Unsplash',
      source: 'https://unsplash.com/photos/paint-roller-in-white-paint-tray-eQ-8iUrb07g',
      license: 'Unsplash License — free for commercial use'
    },
    serviceArea: {
      placeholder: true,
      url: 'https://images.unsplash.com/photo-1785649909829-a48fd52a143a?q=80&w=1800&auto=format&fit=crop',
      alt: 'Rows of homes on a green hillside with a snow-capped Cascade peak rising behind them.',
      credit: 'Photo via Unsplash',
      source: 'https://unsplash.com/photos/residential-area-on-a-hill-with-a-snow-capped-mountain-FdLjqC9Poyw',
      license: 'Unsplash License — free for commercial use'
    }
  },


  /* ------------------------------------------------------------------
     5. SERVICES
     ------------------------------------------------------------------
     `id`    — must match the project-type values used by the quote form
     `photo` — 'project:filename.jpg' pulls from assets/projects/
               'placeholder:key'      pulls from placeholderImages above
               ''                     draws a clean illustrated panel
     ------------------------------------------------------------------ */
  services: [
    {
      id: 'kitchen',
      title: 'Kitchen Remodels',
      blurb: 'Layouts that finally work, built to last.',
      description: 'Full kitchen renovations from demo to the last piece of trim — cabinets, counters, tile, lighting, plumbing and electrical. We handle permits and inspections, and we keep the job site clean because you still have to live here.',
      photo: 'project:kitchen-two-tone-open-plan.jpg',
      icon: 'kitchen'
    },
    {
      id: 'bathroom',
      title: 'Bathroom Remodels',
      blurb: 'Waterproofed right, finished beautifully.',
      description: 'Primary baths, guest baths and powder rooms. Proper waterproofing behind every tiled wall, custom vanities, frameless glass and heated floors if you want them. Most baths wrap in two to four weeks.',
      photo: 'project:primary-bath-corner-tub.jpg',
      icon: 'bath'
    }
    /* ---------------------------------------------------------------
       Whole-Home Renovations, Basements and Flooring & Finish Work
       were taken off the site. To bring one back, paste its block in
       here — the quote form's project picker and the booking dropdown
       both read this list, so they update themselves.

       {
         id: 'whole-home',
         title: 'Whole-Home Renovations',
         blurb: 'One crew, one schedule, start to finish.',
         description: 'Taking a whole house back to studs, or modernising room by room. One point of contact, one schedule, and the same crew through the entire project — no handing you off between subs and hoping it lines up.',
         photo: 'placeholder:wholeHome',
         icon: 'home'
       },
       {
         id: 'basement',
         title: 'Basements',
         blurb: 'Square footage you already own.',
         description: 'Finishing or reworking basements into family rooms, guest suites, offices and rentals. Moisture control and egress handled properly first, then framing, insulation, drywall and finish work.',
         photo: '',
         icon: 'basement'
       },
       {
         id: 'flooring',
         title: 'Flooring & Finish Work',
         blurb: 'The details people actually notice.',
         description: 'Hardwood, engineered, LVP and tile, plus trim, doors, built-ins, stair work and custom carpentry. Often the fastest way to make a whole house feel new again.',
         photo: '',
         icon: 'finish'
       }
       --------------------------------------------------------------- */
  ],


  /* ------------------------------------------------------------------
     6. BOOKING — IN-HOME CONSULTATION CALENDAR
     ------------------------------------------------------------------
     Slots are one hour, Pacific Time. `start` and `end` are 24-hour
     clock. `end` is when the LAST slot finishes, so 9–17 gives you a
     9am slot through a 4pm slot.
     ------------------------------------------------------------------ */
  booking: {
    timezone: 'America/Los_Angeles',
    timezoneLabel: 'Pacific Time',
    slotMinutes: 60,
    leadTimeDays: 2,        // earliest bookable day, counting from today
    bookingWindowDays: 90,  // how far ahead the calendar allows

    // 0 = Sunday, 1 = Monday ... 6 = Saturday
    // `end` is when the LAST consultation finishes, so 8–17 gives an 8am
    // slot through a 4pm slot (each one runs an hour).
    weekly: {
      0: null,                  // Sunday — closed
      1: { start: 8, end: 17 }, // Monday    8am–5pm
      2: { start: 8, end: 17 },
      3: { start: 8, end: 17 },
      4: { start: 8, end: 17 },
      5: { start: 8, end: 17 }, // Friday    8am–5pm
      6: { start: 9, end: 15 }  // Saturday  9am–3pm
    },

    // Dates you're closed, as 'YYYY-MM-DD'. Holidays, vacation, etc.
    blackoutDates: [],

    durationLabel: '1 hour',
    locationLabel: 'In-home consultation'
  },


  /* ------------------------------------------------------------------
     7. SERVICE AREA
     ------------------------------------------------------------------
     `cities` drives the map markers AND the "do we serve your area?"
     checker. `zips` is the ZIP list the checker matches against.
     Add or remove entries freely.
     ------------------------------------------------------------------ */
  serviceArea: {
    // Map centre + zoom. Sits a little south of Everett so the frame holds
    // everything from Arlington down to Seattle and the Eastside.
    mapCenter: { lat: 47.8800, lng: -122.1600 },
    mapZoom: 9,
    radiusMiles: 35,   // shaded circle drawn around Everett

    // Where the circle is centred — your base, not the map's centre.
    radiusCenter: { lat: 47.9790, lng: -122.2021 },

    // `primary: true` cities get a filled marker and are listed in the
    // footer. Coordinates are city centres — close enough for a map pin.
    cities: [
      { name: 'Everett',      lat: 47.9790, lng: -122.2021, primary: true  },
      { name: 'Mukilteo',     lat: 47.9445, lng: -122.3046, primary: true  },
      { name: 'Lynnwood',     lat: 47.8279, lng: -122.3051, primary: true  },
      { name: 'Edmonds',      lat: 47.8107, lng: -122.3774, primary: true  },
      { name: 'Mill Creek',   lat: 47.8601, lng: -122.2043, primary: true  },
      { name: 'Bothell',      lat: 47.7601, lng: -122.2054, primary: true  },
      { name: 'Marysville',   lat: 48.0518, lng: -122.1771, primary: true  },
      { name: 'Lake Stevens', lat: 48.0154, lng: -122.0638, primary: true  },
      { name: 'Snohomish',    lat: 47.9129, lng: -122.0982, primary: true  },
      { name: 'Monroe',       lat: 47.8554, lng: -121.9715, primary: true  },
      { name: 'Arlington',    lat: 48.1987, lng: -122.1251, primary: true  },

      // Seattle and the Eastside — we come down for the right project.
      { name: 'Seattle',      lat: 47.6062, lng: -122.3321, primary: true  },
      { name: 'Bellevue',     lat: 47.6104, lng: -122.2007, primary: true  },

      // Nearby towns we also cover — shown as smaller markers.
      { name: 'Kirkland',           lat: 47.6769, lng: -122.2060, primary: false },
      { name: 'Redmond',            lat: 47.6740, lng: -122.1215, primary: false },
      { name: 'Mercer Island',      lat: 47.5707, lng: -122.2221, primary: false },
      { name: 'Stanwood',           lat: 48.2418, lng: -122.3465, primary: false },
      { name: 'Granite Falls',      lat: 48.0832, lng: -121.9682, primary: false },
      { name: 'Sultan',             lat: 47.8618, lng: -121.8162, primary: false },
      { name: 'Mountlake Terrace',  lat: 47.7884, lng: -122.3087, primary: false },
      { name: 'Brier',              lat: 47.7937, lng: -122.2743, primary: false },
      { name: 'Woodinville',        lat: 47.7543, lng: -122.1635, primary: false },
      { name: 'Kenmore',            lat: 47.7573, lng: -122.2440, primary: false },
      { name: 'Shoreline',          lat: 47.7557, lng: -122.3415, primary: false },
      { name: 'Lake Forest Park',   lat: 47.7573, lng: -122.2807, primary: false },
      { name: 'Tulalip',            lat: 48.0615, lng: -122.2915, primary: false }
    ],

    // Extra spellings the checker should also accept.
    aliases: {
      'mill creek': 'Mill Creek',
      'lake stevens': 'Lake Stevens',
      'mtlk terrace': 'Mountlake Terrace',
      'mountlake': 'Mountlake Terrace',
      'lfp': 'Lake Forest Park',
      'snoho': 'Snohomish',
      'everette': 'Everett',
      'mercer': 'Mercer Island',
      'mercer island': 'Mercer Island',
      'bellvue': 'Bellevue',
      'belleveue': 'Bellevue'
    },

    // ZIPs we serve. Snohomish County, north King County, and Seattle
    // plus the Eastside.
    zips: [
      // Everett
      '98201','98203','98204','98205','98206','98207','98208','98213',
      // Mukilteo / Lynnwood / Edmonds / Mill Creek / Bothell
      '98275','98036','98037','98046','98087','98020','98026','98012','98082',
      '98011','98021','98041','98043',
      // Marysville / Lake Stevens / Snohomish / Monroe / Arlington
      '98270','98271','98258','98290','98291','98296','98272','98223',
      // Surrounding Snohomish County
      '98292','98252','98294','98251','98241','98256','98293','98288',
      // North King County
      '98072','98077','98028','98033','98034','98133','98155','98177',
      // Bellevue / Kirkland / Redmond / Mercer Island
      '98004','98005','98006','98007','98008','98039','98040',
      '98052','98053','98083',
      // Seattle
      '98101','98102','98103','98105','98107','98109','98112','98115',
      '98116','98117','98118','98119','98122','98125','98126','98136',
      '98144','98146','98178','98199'
    ],

    // Shown when a city or ZIP isn't on the list.
    missMessage: "That's outside the area we usually cover — but give us a call, we make exceptions for the right project.",
    hitMessage: "Yes — we work in {place} all the time. Let's get you on the calendar.",
    hitMessageZip: "Yes — {place} is right in our service area. Let's get you on the calendar."
  },


  /* ------------------------------------------------------------------
     8. QUOTE FORM OPTIONS
     ------------------------------------------------------------------ */
  quoteForm: {
    maxPhotos: 5,
    maxPhotoSizeMB: 10,
    timelines: [
      'As soon as possible',
      'Within 1–3 months',
      '3–6 months',
      '6+ months',
      'Just planning and pricing for now'
    ],
    budgets: [
      'Under $15,000',
      '$15,000 – $35,000',
      '$35,000 – $75,000',
      '$75,000 – $150,000',
      '$150,000+',
      'Not sure yet — help me scope it'
    ],
    contactMethods: ['Phone call', 'Text message', 'Email']
  },


  /* ------------------------------------------------------------------
     9. PROCESS STEPS
     ------------------------------------------------------------------ */
  process: [
    {
      title: 'Consultation',
      body: 'We come to you, look at the space, and talk honestly about what is possible and what it costs. No pressure, no sales pitch — usually about an hour.'
    },
    {
      title: 'Design & Estimate',
      body: 'You get a clear written scope and a line-item estimate, along with material selections and a realistic schedule. What you sign is what you pay.'
    },
    {
      title: 'Build',
      body: 'Crew on site, floors protected and the job site swept at the end of every day. You get a single point of contact and a weekly update.'
    },
    {
      title: 'Final Walkthrough',
      body: 'We walk the finished work together and build a punch list. Nothing is called done until you say it is — then your warranty paperwork and care notes follow.'
    }
  ]
};
