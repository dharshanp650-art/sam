// Single source of truth for every painting on the site. Edit a painting here and it
// updates everywhere it appears: the shop grid, the homepage carousels, and its own
// product-detail page. Loaded before script.js on index.html, shop-collection.html,
// and product-detail.html.
//
// price is a plain number in GBP - use formatPrice() to get a display string.
// sizeCategory/frame drive the shop page's filters; cardFrameStyle picks the card's
// visual frame CSS class (currently always 'dark' - all cards render as square tiles,
// cropped with object-fit: cover, regardless of the painting's actual physical size).
//
// furtherReading (array of strings) and references (array of {text, url}) are optional -
// only the exhibition pieces with researched background info have them. When present,
// product-detail.html shows a "Read more" link that reveals a Further Reading and
// References section; products without them simply don't show the link.

const PRODUCTS = {
  'ivefoundit': {
    title: "I've Found It (2022)", artist: 'Samantha Ellis', price: 769,
    image: 'ihavefoundit.webp', images: ['ihavefoundit.webp', 'ihavefoundit.webp', 'ihavefoundit.webp'],
    medium: 'Oil on Canvas', size: '100 × 100 cm', category: 'clouds', sizeCategory: 'small', frame: 'black', cardFrameStyle: 'dark',
    description: "A striking representation of discovery and achievement. This piece captures a moment of realization with bold brushwork and vibrant color transitions that draw the viewer's eye to the central focal point."
  },
  'bliss': {
    title: 'Bliss (2019)', artist: 'Samantha Ellis', price: 769,
    image: 'bliss.png', images: ['bliss.png', 'bliss (2019)_frame.png', 'bliss (2019)_pre.png'],
    medium: 'Oil on Canvas', size: '50 × 50 cm', category: 'clouds', sizeCategory: 'medium', frame: 'white', cardFrameStyle: 'dark',
    description: 'A serene exploration of pure happiness and peaceful moments.'
  },
  'kourtney': {
    title: 'Kourtney (2019)', artist: 'Samantha Ellis', price: 769,
    image: 'kourtney.png', images: ['kourtney.png', 'kourtney (2019)_frame.png', 'kourtney (2019)_pre.png'],
    medium: 'Oil on Canvas', size: '29.7 × 42 cm', category: 'clouds', sizeCategory: 'small', frame: 'black', cardFrameStyle: 'dark',
    description: 'A vibrant portrait study that captures the essence of its subject with expressive brushwork and rich, dynamic colors that bring the figure to life.'
  },
  'fordad': {
    title: 'For Dad (2021)', artist: 'Samantha Ellis', price: 769,
    image: 'fordad.webp', images: ['fordad.webp', 'for dad (2021)_frame.png', 'for dad (2021)_pre.png'],
    medium: 'Oil on Canvas', size: '50 × 50 cm', category: 'clouds', sizeCategory: 'large', frame: 'black', cardFrameStyle: 'dark',
    description: 'A tribute to cherished moments and special bonds.'
  },
  'ivefoundit-i': {
    title: "I've Found It I (2022)", artist: 'Samantha Ellis', price: 769,
    image: 'i’ve found it i.webp', images: ['i’ve found it i.webp', 'find me the moon i (2022) _frame.png', 'find me the moon i (2022)_pre.png'],
    medium: 'Oil on Canvas', size: '120 × 120 cm', category: 'clouds', sizeCategory: 'xlarge', frame: 'white', cardFrameStyle: 'dark',
    description: 'A compelling variation on the discovery theme. This piece explores similar concepts through a different lens, with careful composition and thoughtful color choices.'
  },
  'european-championship': {
    title: "European Women's Championship (July 31st 2022)", artist: 'Samantha Ellis', price: 769,
    image: 'european women’s championship.webp', images: ['european women’s championship.webp', 'european women’s championship (july 31st 2022)_frame.png', 'european women’s championship (july 31st 2022)_pre.png'],
    medium: 'Oil on Canvas', size: '115 × 115 cm', category: 'clouds', sizeCategory: 'medium', frame: 'black', cardFrameStyle: 'dark',
    description: 'A dynamic celebration of athletic achievement and female empowerment. The energetic brushwork and bold color palette convey movement and triumph.'
  },
  'illlookup': {
    title: "I'll Look Up Forever (2021)", artist: 'Samantha Ellis', price: 769,
    image: 'i’ll look up forever.webp', images: ['i’ll look up forever.webp', 'i’ll look up forever (2021)_frame.png', 'i’ll look up forever (2021)_pre.png'],
    medium: 'Oil on Canvas', size: '40 × 40 cm', category: 'clouds', sizeCategory: 'large', frame: 'black', cardFrameStyle: 'dark',
    description: 'An uplifting composition that speaks to hope and aspiration. The vertical composition draws the eye upward, creating a sense of reaching toward something meaningful.'
  },
  'wecanhope': {
    title: 'We Can Only Hope', artist: 'Samantha Ellis', price: 260,
    image: 'we can only hope.png', images: ['we can only hope.png', 'we can only hope (2019)_frame.png', 'we can only hope (2019)_pre.png'],
    medium: 'Oil on Canvas', size: '40 × 40 cm', category: 'clouds', sizeCategory: 'medium', frame: 'white', cardFrameStyle: 'dark',
    description: 'A thoughtful meditation on optimism and possibility. The careful arrangement of forms and subtle color transitions create an atmosphere of quiet resilience.'
  },
  'beyond-words': {
    title: 'Beyond Words (2019)', artist: 'Samantha Ellis', price: 300,
    image: 'beyond words (2019).webp', images: ['beyond words (2019).webp', 'beyond words (2019)_frame.png', 'beyond words (2019)_pre.png'],
    medium: 'Oil on Canvas', size: '50 × 50 cm', category: 'clouds', sizeCategory: 'large', frame: 'black', cardFrameStyle: 'dark',
    description: 'An abstract exploration that transcends literal representation. The layering of materials and techniques creates depth and visual interest that invites contemplation.'
  },
  'untitled-ii': {
    title: 'Untitled II (2019)', artist: 'Samantha Ellis', price: 220,
    image: 'untitled ii (2019).webp', images: ['untitled ii (2019).webp', 'untitled ii (2019)_frame.png', 'untitled ii (2019)_pre.png'],
    medium: 'Oil on Canvas', size: '29.7 × 42 cm', category: 'clouds', sizeCategory: 'small', frame: 'black', cardFrameStyle: 'dark',
    description: 'A minimalist composition that relies on form and color to convey meaning. The restrained palette allows the viewer to focus on the essential elements.'
  },
  'candyfloss-clouds': {
    title: 'Candy Floss Clouds (2019)', artist: 'Samantha Ellis', price: 380,
    image: 'candy floss clouds (2019).webp', images: ['candy floss clouds (2019).webp', 'candy floss clouds (2019)_frame.png', 'candy floss clouds (2019)_pre.png'],
    medium: 'Oil on MDF Board', size: '50 × 50 cm', category: 'clouds', sizeCategory: 'xlarge', frame: 'black', cardFrameStyle: 'dark',
    description: 'A dreamlike landscape capturing the ethereal beauty of the sky. The soft, pastel tones and flowing shapes create an atmosphere of wonder and beauty.'
  },
  'findmethemoon': {
    title: 'Find Me the Moon (2022)', artist: 'Samantha Ellis', price: 330,
    image: 'find me the moon (2022).webp', images: ['find me the moon (2022).webp', 'find me the moon (2022)_frame.png', 'find me the moon (2022)_pre.png'],
    medium: 'Oil on Canvas', size: '100 × 100 cm', category: 'stars', sizeCategory: 'large', frame: 'black', cardFrameStyle: 'dark',
    description: 'A dreamy nocturnal piece celebrating celestial beauty.'
  },
  'findmethemoon-i': {
    title: 'Find Me the Moon I (2022)', artist: 'Samantha Ellis', price: 340,
    image: 'find me the moon i (2022).webp', images: ['find me the moon i (2022).webp', 'find me the moon i (2022)_frame.png', 'find me the moon i (2022)_pre.png'],
    medium: 'Oil on Canvas', size: '120 × 120 cm', category: 'stars', sizeCategory: 'large', frame: 'black', cardFrameStyle: 'dark',
    description: 'A variation on the lunar theme with emphasis on romantic atmosphere. The composition and color harmony create an inviting and emotionally resonant work.'
  },
  'wellingborough': {
    title: 'Wellingborough (2020)', artist: 'Samantha Ellis', price: 320,
    image: 'wellingborough (2020).webp', images: ['wellingborough (2020).webp', 'wellingborough (2020)_frame.png', 'wellingborough (2020)_pre.png'],
    medium: 'Oil on Canvas', size: '50 × 50 cm', category: 'natural-disasters', sizeCategory: 'large', frame: 'black', cardFrameStyle: 'dark',
    description: 'An early morning combined with fumes released from a factory sitting on top of the town on Wellingborough.'
  },
  'hurricane-maria': {
    title: 'Hurricane Maria (2020)', artist: 'Samantha Ellis', price: 400,
    image: 'hurricane maria (2020).png', images: ['hurricane maria (2020).png', 'hurricane maria (2020)_frame.png', 'hurricane maria (2020)_pre.png'],
    medium: 'Oil on Canvas', size: '50 × 50 cm', category: 'natural-disasters', sizeCategory: 'xlarge', frame: 'black', cardFrameStyle: 'dark',
    description: 'This category 5 hurricane formed, September 17th 2017 and averaged winds up to 175 miles per hour. Total deaths equal 3059 and up to £91 billion in damage was caused.'
  },
  'hurricane-katrina': {
    title: 'Hurricane Katrina (2020)', artist: 'Samantha Ellis', price: 360,
    image: 'hurricane katrina (2020).webp', images: ['hurricane katrina (2020).webp', 'hurricane katrina (2020)_frame.png', 'hurricane katrina (2020)_pre.png'],
    medium: 'Oil on Canvas', size: '50 × 50 cm', category: 'natural-disasters', sizeCategory: 'large', frame: 'black', cardFrameStyle: 'dark',
    description: '1,833 people died.'
  },
  'storm-andre': {
    title: 'Storm André (2020)', artist: 'Samantha Ellis', price: 360,
    image: 'storm andré (2020).png', images: ['storm andré (2020).png', 'storm andré (2020)_frame.png', 'storm andré (2020)_pre.png'],
    medium: 'Oil on Canvas', size: '50 × 50 cm', category: 'natural-disasters', sizeCategory: 'large', frame: 'black', cardFrameStyle: 'dark',
    description: 'January 2019 brought Storm André to Europe. Killing 14 people, the storm caused damage to many homes and trapped others.'
  },
  'mount-lamington': {
    title: 'Mount Lamington (2020)', artist: 'Samantha Ellis', price: 360,
    image: 'mount lamington (2020).png', images: ['mount lamington (2020).png', 'mount lamington (2020)_frame.png', 'mount lamington (2020)_pre.png'],
    medium: 'Oil on Canvas', size: '50 × 50 cm', category: 'natural-disasters', sizeCategory: 'large', frame: 'black', cardFrameStyle: 'dark',
    description: 'In 1951 Mount Lamington erupted. Killing over 3000 people this made it the deadliest eruption in Papua New Guinea to date.'
  },
  'mount-sinabung': {
    title: 'Mount Sinabung (2018)', artist: 'Samantha Ellis', price: 360,
    image: 'mount sinabung (2018).png', images: ['mount sinabung (2018).png', 'mount sinabung (2018)_frame.png', 'mount sinabung (2018)_pre.png'],
    medium: 'Oil on Canvas', size: '50 × 50 cm', category: 'natural-disasters', sizeCategory: 'large', frame: 'black', cardFrameStyle: 'dark',
    description: 'In 2016 this Indonesian volcano erupted killing a total of 7 people. This active volcano continues to erupt and cause damage to the local landscape.'
  },
  'mount-st-helens': {
    title: 'Mount St. Helens (2020)', artist: 'Samantha Ellis', price: 360,
    image: 'mount st. helens (2020).webp', images: ['mount st. helens (2020).webp', 'mount st. helens (2020)_frame.png', 'mount st. helens (2020)_pre.png'],
    medium: 'Oil on Canvas', size: '50 × 50 cm', category: 'natural-disasters', sizeCategory: 'large', frame: 'black', cardFrameStyle: 'dark',
    description: 'In 1980 Mount St. Helens erupted caused a pyroclastic flow stretching up to 5 miles, killing 57 people and thousands of animals.'
  },
  'great-smog-1952': {
    title: 'The Great Smog of 1952 (2020)', artist: 'Samantha Ellis', price: 360,
    image: 'the great smog of 1952 (2020).webp', images: ['the great smog of 1952 (2020).webp', 'the great smog of 1952 (2020)_frame.png', 'the great smog of 1952 (2020)_pre.png'],
    medium: 'Oil on Canvas', size: '50 × 50 cm', category: 'natural-disasters', sizeCategory: 'large', frame: 'black', cardFrameStyle: 'dark',
    description: 'In 1952 cold anticyclone air and windless conditions meant the smog produced by the coal burning in London formed a thick layer of smog over the city. As a result, more than 12,000 suffocated.'
  },
  'australian-fires-2020': {
    title: 'Australian Fires (2020)', artist: 'Samantha Ellis', price: 769,
    image: 'australian fires (2020).webp', images: ['australian fires (2020).webp', 'australian fires (2020)_frame.png', 'australian fires (2020)_pre.png'],
    medium: 'Oil on Canvas', size: '50 × 50 cm', category: 'natural-disasters', sizeCategory: 'large', frame: 'black', cardFrameStyle: 'dark',
    description: 'Over the summer between 2019-20 fires started in Australia due to the extreme weather conditions brought about by climate change. The hottest summer on record killed over 25 people, destroyed 46 million acres of land, and killed over 1 billion animals.'
  },
  'icant-lift-my-head-2021': {
    title: 'I Can’t Lift My Head (2021)', artist: 'Samantha Ellis', price: 459,
    image: 'i can’t lift my head (2021).webp', images: ['i can’t lift my head (2021).webp', 'i can’t lift my head (2021)_frame.png', 'i can’t lift my head (2021)_pre.png'],
    medium: 'Oil on Canvas', size: '50 × 50 cm', category: 'landscapes', sizeCategory: 'large', frame: 'black', cardFrameStyle: 'dark',
    description: 'Painted in response to the record-breaking fires of 2019–20, which killed over 25 people, destroyed 46 million acres, and wiped out over 1 billion animals. The work stands as both a tribute and a warning.'
  },
  'contrasting-waves-2017': {
    title: 'Contrasting Waves (2017)', artist: 'Samantha Ellis', price: 219,
    image: 'contrasting waves (2017).webp', images: ['contrasting waves (2017).webp', 'contrasting waves (2017)_frame.png', 'contrasting waves (2017)_pre.png'],
    medium: 'Oil on Canvas', size: '50 × 50 cm', category: 'landscapes', sizeCategory: 'small', frame: 'black', cardFrameStyle: 'dark',
    description: 'A vivid study of the meeting point between chaos and calm. Sweeping, energetic strokes capture the restless movement of waves, while the horizon offers a moment of stillness. The interplay of colour creates a rhythm that speaks to the eternal pull between motion and tranquillity.'
  },
  'untitled2019': {
    title: 'Untitled (2019)', artist: 'Samantha Ellis', price: 120,
    image: 'untitled (2019).png', images: ['untitled (2019).png', 'untitled (2019)_frame.png', 'untitled (2019)_pre.png'],
    medium: 'Oil on Canvas', size: '50 × 50 cm', category: 'drawings', sizeCategory: 'small', frame: 'black', cardFrameStyle: 'dark',
    description: 'A spontaneous composition where acrylic washes merge with the raw texture of chalk and the precision of graphite lines. This piece balances gestural freedom with delicate mark-making, allowing the paper’s surface to become an active participant in the work.'
  },
  'untitled-I-2019': {
    title: 'Untitled I (2019)', artist: 'Samantha Ellis', price: 120,
    image: 'untitled i.png', images: ['untitled i.png', 'untitled i (2019)_frame.png', 'untitled i (2019)_pre.png'],
    medium: 'Oil on Canvas', size: '50 × 50 cm', category: 'drawings', sizeCategory: 'small', frame: 'black', cardFrameStyle: 'dark',
    description: 'Layered with shifting tones and tactile marks, these drawing captures the energy of movement and the pause of stillness in a single frame. The interplay between opaque acrylic passages and translucent chalk whispers creates a rhythm both fragile and assured.'
  },
  'charles-darwin': {
    title: 'Charles Darwin (24th November 1859) (2022)', artist: 'Samantha Ellis', price: 1115,
    image: 'charles darwin (24th november 1859) (2022).jpg', images: ['charles darwin (24th november 1859) (2022).jpg', 'charles darwin (24th november 1859) (2022)_frame.png', 'charles darwin (24th november 1859) (2022)_pre.png'],
    medium: 'Oil on Canvas', size: '120 × 120 cm', category: 'exhibition', sizeCategory: 'large', frame: 'black', cardFrameStyle: 'dark',
    description: 'In the 1850s, the world was moving away from religious orthodoxies and moving more towards the empirical certainties of scientific theory. Charles Darwin was at the centre of this. Through various experiments throughout his life, he developed the theory of Natural Selection. His theories addressed the process of how particular species adapt and change in order to survive.\n\nOn the 24th November 1859, John Murray published Darwin’s On the Origin of Species in London. It was considered to be the foundation of evolutionary biology and many scientific theories that have followed since its publication have been based on Darwin’s philosophy.\n\nThis painting is off the star chart on the day that On the Origin of Species was published. It remains to this day one of the most important dates in the history of scientific thought.',
    furtherReading: ['Read about Charles Darwin on the Natural History Museum website'],
    references: [
      { text: 'The Editors of Encyclopaedia Britannica. (n.d.) On the Origin of Species. Britannica [online]. Accessed 8th September 2022.', url: 'https://www.britannica.com/biography/Charles-Darwin/On-the-Origin-of-Species' }
    ]
  },
  'emily-davision': {
    title: 'Emily Davison (4th June 1913) (2022)', artist: 'Samantha Ellis', price: 900,
    image: 'emily davison (4th june 1913) (2022).webp', images: ['emily davison (4th june 1913) (2022).webp', 'emily davison (4th june 1913) (2022)_frame.png', 'emily davison (4th june 1913) (2022)_pre.png'],
    medium: 'Oil on Canvas', size: '120 × 120 cm', category: 'exhibition', sizeCategory: 'large', frame: 'black', cardFrameStyle: 'dark',
    description: 'The suffragette movement was an English collective formed in 1903 whose aim was to secure the rights to vote for women. Emily Davison was a British suffragette who in 1913 at the Epsom Derby, made the courageous decision to stand in front of King George V’s racehorse.\n\nOn June 4th of that year, Davison stepped onto the racetrack and was struck by the king’s horse. In so doing, she received severe trauma to her head and died four days later in hospital as a result of her injuries. It is suspected that she was attempting to pin a suffragette banner onto the king’s horse so that when photographed crossing the finish line, the event would be connected to the oppression and suffering of women.\n\nDavison’s singular act marked a significant step in terms of gaining equality for women. This painting represents the cloud formation during the moment when she stepped onto the track and in so doing, into history.',
    furtherReading: ['REGISTER TO VOTE', 'We Can Do Hard Things Podcast', 'Exactly. With Florence Given Podcast'],
    references: [
      { text: 'Atkinson, D. (2018) ‘That malignant Suffragette’: remembering Emily Davison. [online]. Accessed 20th July 2022.', url: 'https://www.museumoflondon.org.uk/discover/malignant-suffragette-remembering-emily-wilding-davison' },
      { text: 'BFI National Archive. (2013) The Derby (1913) – Emily Davison trampled by King’s horse. YouTube [online]. Accessed 20th July 2022.', url: 'https://www.youtube.com/watch?v=um9GV6_AILM' },
      { text: 'UK Parliament. (n.d.) Start of the Suffragette Movement. UK Parliament [online]. Accessed 20th August 2022.', url: 'https://www.parliament.uk/about/living-heritage/transformingsociety/electionsvoting/womenvote/overview/startsuffragette-/' }
    ]
  },
  'emmett-till': {
    title: 'Emmett Till (21st August 1955) (2022)', artist: 'Samantha Ellis', price: 900,
    image: 'emmett till (21st august 1955) (2022).webp', images: ['emmett till (21st august 1955) (2022).webp', 'emmett till (21st august 1955) (2022)_frame.png', 'emmett till (21st august 1955) (2022)_pre.png'],
    medium: 'Oil on Canvas', size: '120 × 120 cm', category: 'exhibition', sizeCategory: 'large', frame: 'black', cardFrameStyle: 'dark',
    description: 'Emmett Till was a 14-year-old African American from Chicago who on August 21st 1955 went to work and stay with his uncle in Money, Mississippi. On the 24th of August Till and some friends visited the local grocery store. Although there continues to be a measure of speculation with regard to what happened whilst they were there, it is believed that Till had a minor altercation with the woman working behind the counter, Carolyn Bryant. As a result, four days later Bryant’s husband and half-brother retaliated by breaking into, and abducting Till from his uncle’s home. After beating the child to near death, they disposed of the body in the Tallahatchie River by attaching it to a large fan blade using barbed wire.\n\nHis mother Mammie Till made the fearless decision to have her son’s body shown in an open casket at his funeral in his hometown of Chicago. As a result, and drawing widespread media attention, thousands of people witnessed first-hand the brutality and violence that Till had suffered at the hands of two white men. To this day, his murder remains a significant moment in the civil rights movement.\n\nThe painting is my interpretation of the clouds that had formed on the day Till walked into the grocery store.',
    furtherReading: ['Black Lives Matter', 'The Murder of Emmett Till', 'Red Table Talk Podcast'],
    references: [
      { text: 'Ray, M. (2022) Emmett Till, American Murder Victim. Britannica [online]. Accessed 20th August 2022.', url: 'https://www.britannica.com/biography/Emmett-Till' }
    ]
  },
  'yuri-gagarin': {
    title: 'Yuri Gagarin (12th April 1961) (2022)', artist: 'Samantha Ellis', price: 899,
    image: 'yuri gagarin (12th april 1961) (2022).webp', images: ['yuri gagarin (12th april 1961) (2022).webp', 'yuri gagarin (12th april 1961) (2022)_frame.png', 'yuri gagarin (12th april 1961) (2022)_pre.png'],
    medium: 'Oil on Canvas', size: '120 × 120 cm', category: 'exhibition', sizeCategory: 'large', frame: 'black', cardFrameStyle: 'dark',
    description: 'Yuri Gagarin was a Russian Soviet cosmonaut who, on the 12th April 1961, became the first human to launch into space. His spacecraft, Vostok 1, was launched at 9.07am Moscow time from the Baikonur Cosmodrome in Kazakhstan. Gagarin orbited the earth in 1 hour and 29 minutes and landed safely back at 10.55am.\n\nUp until this point, no human had successfully gone into space. It was the furthest leap beyond our world that had ever happened and helped shape the ever-growing space programme we see today.\n\nFrom the use of a computer system Stellarium I have been able to access the star chart of the precise stars present on the day of Gagarin’s launch.\n\nThe painting depicts the configuration of stars during the moment he launched from the Baikonur Cosmodrome and at the precise time and location it launched from. This is what he would have seen.',
    furtherReading: [
      { text: "Watch footage of Gagarin's launch on Vostok-1 (YouTube)", url: 'https://www.youtube.com/watch?v=JGMvpP2gGy8&t=1s' },
      'Read about Yuri Gagarin on the NASA Website'
    ],
    references: [
      { text: 'Julian Danzer (2017) Yuri Gagarin Launches as First Human in Space on Vostok-1 R7 1961 - Footage and Radio. YouTube [online]. Accessed 8th September 2022.', url: 'https://www.youtube.com/watch?v=JGMvpP2gGy8' },
      { text: 'NASA. (2011) Yuri Gagarin: First Man in Space. NASA [online]. Accessed 8th September 2022.', url: 'https://www.nasa.gov/mission_pages/shuttle/sts1/gagarin_anniversary.html' },
      { text: 'The Editors of Encyclopaedia Britannica. (2022) Yuri Gagarin, Soviet Cosmonaut. Britannica [online]. Accessed 8th September 2022.', url: 'https://www.britannica.com/biography/Yuri-Gagarin' }
    ]
  },
  'stonewall-riots': {
    title: 'Stonewall Riots (27th June 1969) (2022)', artist: 'Samantha Ellis', price: 959,
    image: 'stonewall riots (27th june 1969) (2022).webp', images: ['stonewall riots (27th june 1969) (2022).webp', 'stonewall riots (27th june 1969) (2022)_frame.png', 'stonewall riots (27th june 1969) (2022)_pre.png'],
    medium: 'Oil on Canvas', size: '120 × 120 cm', category: 'exhibition', sizeCategory: 'large', frame: 'black', cardFrameStyle: 'dark',
    description: 'In 1969 homosexual acts were still illegal in nearly all states of America. Any establishments serving alcohol to anyone who was deemed to be part of the homosexual community or any businesses that employed someone who was gay could be shut down.\n\nThe Stonewall Inn was a safe space in Greenwich Village, New York City that was frequented by members of the LGBTQ+ community. On June 24th the establishment was raided by the police. During the raid, liquor was confiscated and several of its customers were assaulted.\n\nAround midnight on June 27th the police raided Stonewall for a second time. On this occasion, police officers nearly beat someone to death who identified as transgender. As a result, and in defiance at police brutality, a riot broke out. Over the course of the night bottles were thrown, tyres were slashed and fights began until at 4.00am the police retreated into the Stonewall Inn to barricade themselves. More heavily armed police were called and although on June 28th the Stonewall Inn eventually reopened, the police continued to beat and teargas the crowd. By this point many crowds had started to gather in support of the gay community and Stonewall became a meeting and protesting point, attracting in the process huge media coverage.\n\nTo this day, Stonewall is considered as one of the most significant moments in the development of the gay rights movement.\n\nThis painting is based on the star charts of the night of June 27th. The painting depicts what the sky would have looked like from the Stonewall Inn in New York. Against the backdrop of this night-time sky, people were fighting for their right to decide how to live and who to love.',
    furtherReading: ['About the Stonewall Riots on the Stonewall UK Website'],
    references: [
      { text: 'Pruitt, S. (2019) What Happened at the Stonewall Riots? A Timeline of the 1969 Uprising. History [online]. Accessed 8th September 2022.', url: 'https://www.history.com/news/stonewall-riots-timeline' }
    ]
  },
  'sarah-everard': {
    title: 'Sarah Everard (12th March 2021) (2022)', artist: 'Samantha Ellis', price: 1049,
    image: 'sarah everard (12th march 2021) (2022).webp', images: ['sarah everard (12th march 2021) (2022).webp', 'sarah everard (12th march 2021) (2022)_frame.png', 'sarah everard (12th march 2021) (2022)_pre.png'],
    medium: 'Oil on Canvas', size: '120 × 120 cm', category: 'exhibition', sizeCategory: 'large', frame: 'black', cardFrameStyle: 'dark',
    description: 'Having left her friend’s house on the evening of March 3rd 2021, Sarah Everard began her walk home through Clapham Common. At some point during her journey she was stopped by Wayne Couzens, a serving Police Officer. Couzens handcuffed and placed Everard into a hire car. She was reported missing the morning of March 4th by her boyfriend. Couzens had raped and strangled Sarah before disposing her ashes in a woodland in Kent. Couzens was arrested and later sentenced to life in prison. Everard’s body was found on 10th March 2021.\n\nAn investigation was launched into her murder by the Metropolitan Police following the failure of police officers within the force. A vigil was organised by members of Reclaim These Streets on March 13th, but was later cancelled due to Covid 19 restrictions. Despite the cancellation of the event, hundreds still came to protest about violence against woman and to remember Everard.\n\nEverard’s death was a significant moment in the ongoing fight to protect women and reminds us of the fundamental right women have to feel safe in a public space.\n\nThis painting is the cloud formation of the 12th March, the day I found out Sarah had been raped, murdered and burnt.',
    furtherReading: ['Reclaim These Streets', 'UN Women', 'End Violence Against Women'],
    references: [
      { text: 'HMICFRS. (2021) The Sarah Everard vigil - An inspection of the Metropolitan Police Service’s policing of a vigil held in commemoration of Sarah Everard on Clapham Common on Saturday 13 March 2021. HMICFRS [online]. Accessed 8th September 2022.', url: 'https://www.justiceinspectorates.gov.uk/hmicfrs/publication-html/inspection-metropolitan-police-services-policing-of-vigil-commemorating-sarah-everard-clapham-common/' },
      { text: 'Roberts, C. (2022) What happened to Sarah Everard? When did she go missing, how old was she, who killed her and aftermath. National World [online]. Accessed 8th September 2022.', url: 'https://www.nationalworld.com/news/what-happened-to-sarah-everard-when-she-went-missing-who-murdered-her-and-aftermath-explained-3591052' }
    ]
  }
};

// Every entry defaults its alt text to its own title unless overridden here.
Object.keys(PRODUCTS).forEach(id => {
  if (!PRODUCTS[id].alt) PRODUCTS[id].alt = PRODUCTS[id].title;
});

// Visual order for the shop grid - matches the site's original card order.
const SHOP_GRID_ORDER = [
  'ivefoundit', 'bliss', 'kourtney', 'fordad', 'ivefoundit-i',
  'european-championship', 'illlookup', 'wecanhope', 'beyond-words',
  'untitled-ii', 'candyfloss-clouds', 'findmethemoon', 'findmethemoon-i', 'wellingborough',
  'hurricane-maria', 'hurricane-katrina', 'storm-andre', 'mount-lamington', 'mount-sinabung',
  'mount-st-helens', 'great-smog-1952', 'australian-fires-2020', 'icant-lift-my-head-2021',
  'contrasting-waves-2017', 'untitled2019', 'untitled-I-2019', 'charles-darwin',
  'emily-davision', 'emmett-till', 'yuri-gagarin', 'stonewall-riots', 'sarah-everard'
];

// Curated subsets for the homepage carousels.
const FEATURED_CAROUSEL_ORDER = ['ivefoundit', 'bliss', 'findmethemoon', 'fordad', 'beyond-words', 'wecanhope', 'candyfloss-clouds'];
const TRENDING_CAROUSEL_ORDER = [...FEATURED_CAROUSEL_ORDER, 'findmethemoon-i'];

function formatPrice(n) {
  return '£' + Number(n).toFixed(2);
}
