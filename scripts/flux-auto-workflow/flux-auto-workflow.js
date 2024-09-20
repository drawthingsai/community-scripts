//@api-1.0
// v3.0
// Author: @czkoko
// This workflow will require two models Flux Dev and Dev to Schnell 4-Step lora at the same time. 
// Provide three different performance modes for users to choose from, optimized parameters, suitable for beginners.
// You only need to fill in the prompts and select the Performance Mode and Image Size. 

//
// Select the accuracy of the model. If you need a more accurate quantization model, please set this constant to `false`, and use Flux Dev (8-bit) by default.
//
const useFlux8bit = true;
//
//
//


const version = "v3.0";
var promptsSource = pipeline.prompts.prompt;

const promptsSourceInput = requestFromUser(
  `Flux Auto Workflow ${version}`,
  "Next",
  function () {
    return [
      this.section(
        "❖  Workflow Mode",
        "• Flux Model: The optimization parameters will be set automatically for Flux.\n• Other Model: SDXL, SD3, etc. Parameters need to be set manually.\n• Image Refiner: Refine the existing image on the canvas automatically.",
        [
          this.segmented(0, ["🌊  Flux Model   ", "🧩  Other Model   ", "✨  Image Refiner   "]),
        ]
      ),
      this.section(
        "❖  Prompt Source",
        "• Select the source of the prompt.",
        [
          this.segmented(0, ["📝  Custom Prompt   ", "🎲  Random Prompt   "]),
        ]
      ),
      this.section(
        "❖  Random Prompt Image Type",
        "• Select the type of the image.",
        [
          this.segmented(0, ["👤  Subject   ", "🏡  Scene   "]),
        ]
      ),
      this.section(
        "❖  Random Prompt Imagination level",
        "• Creative: Have more whimsical action costume combinations and rich imagination.\n• Conservative: Imagination is more conservative and more loyal to reality.",
        [
          this.segmented(0, ["🎨  Creative   ", "💭  Conservative   "]),
        ]
      ),
      this.section(
        "❖  Random Prompt Quantity",
        "•  The number of random prompts to be generated.",
        [
          this.slider(10, this.slider.fractional(0), 1, 30, ""),
        ]
      ),
      this.section(
        "❖  Random Prompt Style Filter",
        "• Filter the styles you don't need.",
        [
          this.switch(true, "✡︎   Photography"),
          this.switch(true, "✡︎   Cinematic"),
          this.switch(false, "✡︎   Vintage Film"),
          this.switch(false, "✡︎   Lomo Film"),
          this.switch(false, "✡︎   3D Render"),
          this.switch(false, "✡︎   Cartoon"),
          this.switch(false, "✡︎   Comic Book"),
          this.switch(false, "✡︎   Surrealism"),
          this.switch(false, "✡︎   Illustration"),
          this.switch(false, "✡︎   Fantasy"),
        ]
      ),
      this.section(
        "❖  Random Prompt Custom Prefix",
        "•  Add custom prefix to random prompts, such as the keyword to trigger lora.",
        [
          this.textField("", "keyword", false, 10),
        ]
      ),
    ];
  }
);

const style = [
  "Photography style, realistic details, life-like",
  "Cinematic style, Film particles, Orange-blue tone",
  "Vintage film style, grainy texture",
  "Lomo style, faded and dreamy",
  "3D render, ray tracing, keyshot",
  "Cartoon style, digital artwork",
  "Comic book style, graphic illustration, comic art, graphic novel art",
  "Surrealism, abstract shapes and forms",
  "Illustration style, conceptual art, lines",
  "Fantasy, ethereal and mystical"
];

const light = [
  "Sunny day",
  "Cloudy day",
  "Light from side",
  "Light from top",
  "Light from back",
  "Bright light",
  "Golden hour sunlight",
  "Subtle candlelight",
  "Dramatic spotlight cutting through darkness",
  "Neon light",
  "Dim light",
  "Soft, diffused light",
  "Cinematic lighting",
  "Warm light",
  "Cool, bluish light",
  "Gentle, soft glow",
  "Sharp, focused beam of light",
  "Pulsing light",
  "Bright, glaring light",
  "Soft, ambient light",
  "Shimmering, scattered light",
  "Muted, low light",
  "natural light",
  "Bright, radiant light",
  "Dappled, broken light",
  "Hazy, diffused glow",
  "contrasting light",
  "Faint, barely-there light",
  "Glowing, ethereal light",
  "subtle light"
];

const male = [
  "A little boy",
  "A young man",
  "A middle-aged man",
  "An old man",
  "A little boy with short, spiky hair and a mischievous grin",
  "A young boy with curly brown hair and a round, freckled face",
  "A teen boy with long, shaggy hair and acne on his cheeks",
  "A young man with short, buzzed hair and a sharp jawline",
  "A young man with a man-bun and a thin mustache",
  "A man in his 20s with wavy, medium-length hair and a clean-shaven face",
  "A man in his 20s with straight, parted hair and a light stubble",
  "A man in his 30s with short, styled hair and a prominent chin",
  "A man in his 30s with a shaved head and a full beard",
  "A man in his 40s with slightly graying hair and laugh lines around his eyes",
  "A man in his 40s with a receding hairline and a square jaw",
  "A middle-aged man with thick glasses, a mustache, and thinning hair",
  "A middle-aged man with shoulder-length hair tied back and a rugged face",
  "A man in his 50s with salt-and-pepper hair and a strong brow",
  "A man in his 50s with a balding crown and a goatee",
  "An older man with a full head of white hair and a bushy mustache",
  "An older man with a long beard and deep-set eyes",
  "An elderly man with a bald head, deep wrinkles, and kind eyes",
  "An elderly man with wispy white hair and sunken cheeks",
  "A very old man with a stooped posture, thin white hair, and a gentle smile",
  "A man in his 60s with a gray beard and a weathered face",
  "A man in his 60s with slicked-back gray hair and a stern expression",
  "A man in his 70s with a bald head, a prominent nose, and kind eyes",
  "A man in his 70s with white hair combed to the side and a trimmed beard",
  "An elderly man with a full white beard and a wrinkled, leathery face"
];

const female = [
  "A little girl",
  "A young woman",
  "A middle-aged woman",
  "An elderly woman",
  "A little girl with short, straight hair and rosy cheeks",
  "A little girl with curly pigtails and big, wide eyes",
  "A young girl with long, braided hair and a bright smile",
  "A teenage girl with shoulder-length wavy hair and freckles",
  "A teenage girl with straight, black hair and sharp features",
  "A young woman with long, flowing hair and high cheekbones",
  "A young woman with a pixie cut and a playful smile",
  "A woman in her 20s with short, bobbed hair and soft eyes",
  "A woman in her 20s with thick, curly hair and an oval face",
  "A woman in her 30s with medium-length hair and a few wrinkles around her eyes",
  "A woman in her 30s with long, straight hair and a confident expression",
  "A middle-aged woman with shoulder-length wavy hair and laugh lines",
  "A middle-aged woman with a high ponytail and tired eyes",
  "A woman in her 40s with graying hair and a warm smile",
  "A woman in her 40s with short hair and a strong jawline",
  "A woman in her 50s with shoulder-length hair and slight crow's feet",
  "A woman in her 50s with a curly bob and a gentle expression",
  "An older woman with a bun of white hair and a round, wrinkled face",
  "An older woman with long, graying hair and a serene expression",
  "An elderly woman with thin white hair and deep wrinkles around her mouth",
  "An elderly woman with short, curly hair and sunken cheeks",
  "A very old woman with her hair in a tight bun and soft, kind eyes",
  "A woman in her 60s with a bob of silver hair and a proud posture",
  "A woman in her 70s with long, white hair and a gentle smile",
  "An elderly woman with short white hair, deep-set eyes, and a frail frame"
];

const animal = [
  "A dog",
  "Three dogs",
  "A cute kitten",
  "A cat",
  "Two cats",
  "A horse",
  "A colorful parrot",
  "A rabbit",
  "A deer",
  "A fox",
  "A bear",
  "A wolf",
  "A group of wolfs",
  "A lion",
  "Five lions",
  "A dragon",
  "A unicorn",
  "A squirrel",
  "A giraffe",
  "A zebra",
  "An elephant",
  "A monkey",
  "A group of monkeys",
  "A kangaroo",
  "A panda",
  "A penguin",
  "A turtle",
  "A hedgehog",
  "A raccoon",
  "A cheetah",
  "An owl",
  "A seal",
  "A camel",
  "A llama",
  "Two llamas",
  "A koala",
  "A moose",
  "A crocodile",
  "A flamingo",
  "A peacock",
  "A hedgehog",
  "A platypus",
  "A bison"
];

const job = [
  "wizard",
  "knight",
  "robot",
  "alien",
  "superhero",
  "supervillain",
  "princess",
  "prince",
  "king",
  "queen",
  "farmer",
  "chef",
  "musician",
  "painter",
  "dancer",
  "group of dancers",
  "astronaut",
  "scientist",
  "teacher",
  "student",
  "group of students",
  "police officer",
  "firefighter",
  "doctor",
  "nurse",
  "soldier",
  "group of soldiers",
  "pirate",
  "ninja",
  "samurai",
  "monk",
  "priest",
  "nun",
  "ghost",
  "group of ghosts",
  "vampire",
  "zombie",
  "mummy",
  "skeleton",
  "clown",
  "jester",
  "bard",
  "blacksmith",
  "fisherman",
  "hunter",
  "gatherer",
  "traveler",
  "explorer",
  "journalist",
  "architect",
  "engineer",
  "pilot",
  "librarian",
  "mechanic",
  "gardener",
  "artist",
  "actor",
  "director",
  "photographer",
  "writer",
  "editor",
  "nanny",
  "barista",
  "waiter",
  "diplomat",
  "translator",
  "biologist",
  "historian"
];

const specialCharacters = [
  "Donald John Trump",
  "Albert Einstein",
  "Martin Luther King Jr.",
  "Nelson Mandela",
  "Elon Musk",
  "Mahatma Gandhi",
  "Steve Jobs",
  "Mickey Mouse",
  "Sherlock Holmes",
  "Harry Potter",
  "James Bond",
  "Indiana Jones",
  "Darth Vader",
  "Frodo Baggins",
  "Hannibal Lecter",
  "Jack Sparrow",
  "Katniss Everdeen",
  "Tony Stark",
  "Walter White",
  "Lara Croft",
  "Homer Simpson",
  "Santa Claus",
  "Winnie the Pooh",
  "The Joker",
  "James T. Kirk",
  "Wonder Woman",
  "Batman",
  "Iron Man",
  "Spider-Man",
  "Daredevil",
  "Superman",
  "The Terminator",
  "Alexander the Great",
  "Napoleon Bonaparte",
  "Winston Churchill",
  "Joan of Arc",
  "Bruce Lee",
  "Muhammad Ali",
  "Charlie Chaplin",
  "Michael Jackson",
  "Luke Skywalker",
  "Hermione Granger",
  "Scarlet Witch",
  "Doctor Strange",
  "Captain America",
  "John Wick",
  "Buzz Lightyear"
];

const groupPerson = [
  "A middle-aged couple",
  "A group of three small children",
  "A group of teenagers",
  "A family of four",
  "Two siblings, one older",
  "A group of young boys",
  "A pair of best friends",
  "An elderly couple",
  "A mother with her young daughter",
  "A father and son",
  "A group of children of various ages",
  "A young couple",
  "A police officer and a thief",
  "A wizard and a knight",
  "A robot and a human",
  "A pirate and a sailor",
  "A spy and a diplomat",
  "A vampire and a werewolf",
  "A king and a rebel",
  "A superhero and a villain",
  "A zombie and a survivor",
  "A dragon and a knight",
  "A witch and a fairy",
  "A time traveler and a historian",
  "A samurai and a ninja",
  "A detective and a ghost",
  "A robot and an alien",
  "A superhero and a mutant",
  "A wizard and a scientist",
  "A queen and a spy",
  "A dragon and a sorcerer",
  "A cowboy and a futuristic",
  "A superhero and an alien"
];

const maleDresses = [
  // Daily and modern clothing
  "Business suit with a sharp tie",
  "Casual T-shirt and shorts",
  "A tuxedo with a red bowtie",
  "A flannel shirt and rugged boots",
  "Leather jacket and aviator sunglasses",
  "A long trench coat with a hidden weapon",
  "Modern, minimalist black suit",
  "Sporty outfit with sneakers",
  "Classic white shirt and denim overalls",
  "A cowboy's hat, boots, and spurs",
  "A samurai's full armor with a katana",
  "A musketeer's tunic and feathered hat",
  "A police officer's uniform with a badge",
  "A firefighter's heavy protective gear",
  "A soldier's camouflage uniform and helmet",
  "A construction worker's hard hat and tool belt",
  "A doctor's white lab coat with a stethoscope",
  "A chef's hat",
  "A scientist's lab coat covered in chemical stains",
  "A teacher's cardigan and khaki pants",

  // Traditional and cultural costumes
  "Traditional Japanese kimono with a wide obi belt",
  "Scottish tartan kilt with a sporran",
  "Middle Eastern kaftan with delicate patterns",
  "A Viking tunic with fur accents",
  "A Maasai shuka with beaded jewelry",

  // Historical clothing
  "A Roman gladiator's armor with a crested helmet",
  "A medieval peasant's tunic and belt",
  "A musketeer's tunic and feathered hat",
  "A knight's shining plate armor with a crest",
  "A Roman senator's toga with golden laurel crown",

  // Fantasy and mythical costumes
  "A pirate's tattered coat and tricorne hat",
  "A warrior's fur-lined cape and leather bracers",
  "A dragon-scale armor with glowing runes",
  "A steampunk adventurer's outfit with brass goggles",
  "A futuristic bodysuit with armor plating",
  "A futuristic police uniform with a tactical visor",
  "A mech pilot's flight suit with tech interfaces",
  "A space captain's uniform with insignias",
  "A rebel fighter's rugged gear with gadgets",
  "A battle suit with laser gauntlets and shields"
];

const femaleDresses = [
  // Daily and modern clothing
  "Flowing silk gown adorned with intricate embroidery",
  "Elegant evening gown with sparkling sequins",
  "Vintage polka dot dress",
  "Summer dress with floral patterns",
  "Casual jeans and a futuristic jacket",
  "A comfy hoodie and jeans",
  "A Victorian lace dress with a corset",
  "A Renaissance-era gown with puffed sleeves",
  "A business suit with a pencil skirt",
  "Sporty outfit with leggings and sneakers",
  "A summer sundress with floral patterns",
  "A traditional Hawaiian hula skirt made of leaves",
  "A librarian's glasses and cozy sweater",
  "A painter's smock covered in colorful paint splatters",
  "A nurse's scrubs with a comforting smile",
  "A teacher's cardigan and pencil skirt",

  // Traditional and cultural costumes
  "Chinese qipao with intricate dragon embroidery",
  "Indian sari with golden thread details",
  "A Spanish flamenco dress with ruffles",
  "An embroidered Russian sarafan",
  "A colorful Mexican huipil with floral patterns",
  "A traditional African dashiki",
  "A Middle Eastern kaftan with delicate patterns",
  "A Viking tunic with fur accents",

  // Historical clothing
  "A Victorian lace dress with a corset",
  "A Baroque ball gown with intricate ruffles",
  "A 1920s flapper dress with fringe",
  "A 1950s poodle skirt with a scarf",
  "A 1960s mod dress with bold geometric patterns",
  "A medieval peasant's tunic and belt",
  "A medieval nun's robe and cross",

  // Fantasy and mythical costumes
  "A fairy's delicate dress made of flower petals",
  "A mystical cloak that shifts colors with the light",
  "A witch's dark, flowing gown and pointed hat",
  "A steampunk adventurer's outfit with brass goggles",
  "A Valkyrie's armor with feathered wings",
  "A futuristic bodysuit with glowing circuits",
  "A dragon-scale armor with glowing runes",
  "A pirate's tattered coat and tricorne hat",
  "A princess's flowing gown with jeweled tiara",
  "A sorcerer's robe with arcane symbols",
  "A knight's shining plate armor with a crest"
];

const dailyScenes = [
  "A quiet suburban neighborhood",
  "A cozy cafe on a rainy afternoon",
  "A modern apartment with floor-to-ceiling windows",
  "A bustling farmers' market",
  "A train speeding through the countryside",
  "A grand city plaza with towering skyscrapers",
  "A cozy bedroom",
  "A flower-filled meadow at dawn",
  "A tropical beach with crystal clear water",
  "A quaint bakery on a cobblestone street",
  "A bustling airport terminal",
  "A crowded subway station with commuters rushing",
  "A rooftop garden overlooking a bustling city",
  "A modern art gallery with abstract sculptures",
  "A quiet library with towering bookshelves",
  "A large greenhouse filled with exotic plants",
  "A horse stable in a countryside manor",
  "A cozy cabin in the middle of a snowy forest",
  "A lush vineyard in the countryside",
  "A train station in the middle of nowhere",
  "A crowded amusement park with colorful rides",
  "A busy sports stadium during a championship game",
  "A graffiti-covered alley in an industrial area",
  "A calm lake surrounded by towering mountains",
  "A serene meadow filled with wildflowers",
  "A bustling medieval marketplace",
  "A Viking village near a frozen fjord",
  "A Victorian-era street filled with carriages",
  "A samurai dojo surrounded by cherry blossoms",
  "An Egyptian temple with towering obelisks",
  "A 1920s jazz club filled with dancing and music",
  "A medieval castle with stone walls and torches",
  "A Roman bathhouse with steaming pools",
  "A quiet suburban neighborhood",
  "A small-town diner with vintage decor",
  "A sunny park with children playing",
  "A local library with reading nooks",
  "A farmer's field with ripe crops",
  "A community swimming pool",
  "A neighborhood block party",
  "A busy street market with fresh produce",
  "A family living room with cozy furniture",
  "A well-tended garden with blooming flowers",
  "A quaint coffee shop with outdoor seating",
  "A suburban backyard with a barbecue grill",
  "A city street lined with boutique shops",
  "A playground with swings and slides",
  "A yoga studio with calming music",
  "A riverside picnic with a checkered blanket",
  "A vintage bookstore with wooden shelves",
  "A botanical garden with exotic plants",
  "A peaceful nature trail through the woods",
  "A weekend farmers' market with local goods",
  "A contemporary art museum with interactive exhibits",
  "A cozy cabin with a crackling fireplace",
  "A beachside boardwalk with street performers",
  "A local bakery with freshly baked bread",
  "A city park with a fountain and benches",
  "A suburban street with autumn leaves",
  "A home garden with vegetable patches",
  "A crowded farmer's market with seasonal produce",
  "A beach with volleyball nets and sunbathers",
  "A local theater with a community play",
  "A suburban pool party with floats and music",
  "A pet store with a variety of animals",
  "A city zoo with family-friendly exhibits",
  "A local craft fair with handmade goods",
  "A vineyard with a wine tasting room",
  "A rural farmhouse with a barn",
  "A sunny café patio with potted plants",
  "A city rooftop bar with skyline views",
  "A town square with a weekly market",
  "A contemporary dance studio with a rehearsal",
  "A home workshop with DIY projects",
  "A suburban street with holiday decorations",
  "A minimalist, monochromatic urban neighborhood with tall, sleek buildings fading into misty horizons, blending reality with dreamlike abstraction",
  "A warm, golden-hued cafe with soft glowing lights and rain-soaked windows that reflect streaks of neon, as light bounces off puddles and creates a surreal, almost impressionistic ambiance",
  "An ultra-modern apartment with oversized geometric windows, the city skyline blurred and refracted through glass prisms, casting vibrant, abstract patterns across minimalist furniture",
  "A suburban street, adorned with extravagant holiday decorations, but transformed into a dreamy, ethereal display of glowing orbs and shimmering",
  "A foggy forest where towering trees merge into abstract lines, and beams of sunlight pierce through in soft",
  "A desert landscape with massive, abstract dunes sculpted by the wind, the sand reflecting iridescent colors under a deep blue sky",
  "A Parisian street at dawn, with soft golden light reflecting off wet cobblestones, while iconic rooftops and wrought-iron balconies create a timeless, romantic atmosphere",
  "A lush, tropical rainforest, the dense foliage illuminated by shafts of sunlight that create patterns of light and shadow, while mist rises from the undergrowth",
  "A minimalist landscape of intersecting black and white lines, creating geometric shapes that seem to float in a stark, infinite white space",
  "An abstract composition of overlapping translucent circles in pastel hues, their edges softly blending together to create a calming gradient of color and light",
  "A futuristic grid of perfect cubes and spheres, suspended in a glowing space where each shape casts sharp shadows, creating a dynamic interplay of light and form",
  "A fluid, wave-like pattern of flowing curves and arcs, rendered in bold primary colors, evoking the sense of continuous movement and rhythm",
  "A deconstructed cityscape made entirely of sharp, angular triangles and rectangles, each surface reflecting metallic or matte textures in varying shades of gray",
  "A surreal space of floating, interconnected rings and lines, each element glowing softly in pastel neon colors, forming a complex yet harmonious structure",
  "A series of stacked, monochromatic cubes in various sizes, arranged in a staggered pattern, creating depth and a sense of organized chaos against a neutral backdrop",
  "A minimalist design of smooth, continuous lines that form abstract, flowing shapes, suspended in midair, evoking a sense of balance and harmony in motion",
  "A kaleidoscopic array of sharp, geometric prisms and polygons in vibrant colors, their edges reflecting light in a way that fragments the surrounding space",
  "A soft, ethereal blend of thin, interweaving lines and geometric shapes, all in muted pastel tones, creating a feeling of serene complexity and delicate balance",
  "A seamless pattern of concentric circles and sharp intersecting lines, all in grayscale, creating an optical illusion of depth and movement",
  "A gradient of fading, parallel lines in varying thicknesses, transitioning from bold, sharp edges to soft, diffused endings, forming an elegant visual flow",
  "A minimalist composition of floating, translucent squares and rectangles, where each shape subtly overlaps and shifts, creating layers of muted tones and depth",
  "An intricate web of crisscrossing, neon-colored lines, forming geometric shapes that pulse with soft glows against a dark, matte background, evoking a digital aesthetic",
  "A three-dimensional spiral of interlocked, metallic polygons, where light plays across the surfaces, casting angular shadows that shift as if in motion"
];

const specialScenes = [
  "A dense, fog-covered forest at dusk",
  "A cascading waterfall in a lush jungle",
  "A vast desert with sand dunes stretching to the horizon",
  "A stormy sea crashing against jagged cliffs",
  "A glowing cave filled with crystals",
  "A frozen tundra with icy winds",
  "A dark forest with towering ancient trees",
  "A tropical rainforest with misty rain",
  "A misty swamp with vines hanging from trees",
  "A rocky canyon illuminated by the setting sun",
  "A volcanic landscape with molten lava flows",
  "A starry desert night with distant howling winds",
  "An enchanted forest with glowing mushrooms",
  "A mystical cave with glowing runes on the walls",
  "A dark, abandoned castle",
  "A magical library filled with levitating books",
  "A haunted mansion",
  "An ancient temple hidden deep within a jungle",
  "A crystal palace in the middle of a frozen lake",
  "A forgotten city overgrown with vines",
  "A dragon's lair filled with treasure",
  "A labyrinth of mirrors reflecting endless possibilities",
  "A tower in the middle of a mystical forest",
  "A ghostly ship sailing through the fog",
  "An underground cavern lit by glowing fungi",
  "A futuristic city with flying cars and neon lights",
  "A high-tech laboratory filled with robotic arms",
  "A cyberpunk alleyway filled with neon signs and graffiti",
  "An alien planet with strange plants and floating rocks",
  "A utopian city with glass towers and holograms",
  "A spaceship",
  "A post-apocalyptic wasteland with ruined buildings",
  "A robotic factory with assembly lines and sparks flying",
  "A virtual reality world with pixelated landscapes",
  "A desert planet with two suns and endless dunes",
  "A futuristic marketplace filled with exotic goods",
  "A cybernetic forest where trees are intertwined with machines",
  "A neon-lit nightclub in a futuristic metropolis",
  "A colossal spaceship hangar with advanced technology",
  "A world where everything is made of candy",
  "An underwater kingdom with glowing creatures",
  "A land where the sky is filled with floating lanterns",
  "A realm where time flows backward",
  "A desert of glass shards reflecting the stars",
  "A forest where the trees are made of light",
  "A circus tent with acrobats performing high above",
  "A magical workshop filled with enchanted objects",
  "An old-fashioned theater with red velvet seats",
  "The Yellow Brick Road in *The Wizard of Oz*",
  "The floating diner in *Inception*",
  "The end of the world in *Mad Max: Fury Road*",
  "The Hogwarts Great Hall in *Harry Potter* series",
  "The T-Rex chase in *Jurassic Park*",
  "The space station in *2001: A Space Odyssey*",
  "The giant wave in *Interstellar*",
  "The Casablanca airport scene in *Casablanca*",
  "The iconic dance scene in *Pulp Fiction*",
  "The DeLorean time travel in *Back to the Future*",
  "The beachfront sunset in *The Graduate*",
  "The battlefield in *Gladiator*",
  "The grand ball scene in *Beauty and the Beast*",
  "The iconic trench warfare in *All Quiet on the Western Front*",
];

const dailyActions = [
  "spreading butter on toast",
  "plucking petals from a flower",
  "spreading a blanket on the ground",
  "peeling fruit with a knife",
  "buttoning up a coat",
  "gazing into the distance",
  "dancing gracefully",
  "standing tall with determination",
  "sitting by a warm fire",
  "playing a melodious tune on a violin",
  "watering a small plant",
  "holding a cup of steaming coffee",
  "riding a bicycle",
  "holding a candle to light the way",
  "organizing spices on a shelf",
  "blowing on a dandelion",
  "sketching a landscape in a notebook",
  "taking a photograph with an old camera",
  "sipping tea",
  "knitting a colorful scarf",
  "playing chess",
  "blowing a kiss playfully",
  "saluting with a serious face",
  "giving a peace sign",
  "covering mouth in surprise",
  "placing hands on hips while smiling",
  "making a heart shape with hands",
  "holding up a finger to signal quiet",
  "winking cheekily",
  "clapping hands slowly with approval",
  "raising eyebrows in amusement",
  "pointing finger to lips in thought",
  "crossing fingers for good luck",
  "holding both hands up in surrender",
  "gesturing to come closer",
  "shrugging with a carefree smile",
  "placing one hand over the chest",
  "rubbing chin thoughtfully",
  "blowing a raspberry at the camera",
  "mocking a strongman pose",
  "flexing arms to show off muscles",
  "tipping an imaginary hat",
  "holding hands up in celebration",
  "making a silly face with tongue out",
  "giving a slow, exaggerated wink",
  "doing finger guns playfully",
  "resting chin on hand with a smirk",
  "with a sense of wonder",
  "with a look of fear",
  "with an expression of joy",
  "with deep sorrow in their eyes",
  "filled with hope",
  "lost in thought",
  "radiating confidence",
  "looking anxious and uneasy",
  "with a mischievous grin",
  "looking determined and strong",
  "with a serene calmness",
  "on the brink of tears",
  "overcome with anger",
  "in deep contemplation",
  "with a big smile",
  "with a quiet smile",
  "covering face with hands in shyness",
  "pointing two thumbs at themselves",
  "throwing hands up in frustration",
  "making an exaggerated sad face",
  "crossing arms with a playful pout",
  "showing a skeptical expression while raising one eyebrow",
  "leaning forward with hands on knees",
  "giving a high-five to the camera",
  "feeding pigeons",
  "folding origami animals",
  "composing a letter by candlelight",
  "spinning thread from wool",
  "giving a thumbs-up with confidence",
  "crossing arms and nodding slightly",
  "tilting head with a curious expression",
  "releasing a paper boat into a stream",
  "polishing a pair of boots",
  "chopping vegetables for a meal",
  "rolling out dough for baking",
  "cleaning an old pair of glasses",
  "setting up a telescope for stargazing",
  "writing formulas on a chalkboard",
  "sewing a patch onto a garment",
  "tuning the strings of a guitar",
  "wiping sweat from a brow after hard work",
  "planting seeds carefully into the soil"
];

const specialActions = [
  "exploring an ancient map",
  "casting a powerful spell",
  "floating weightlessly in mid-air",
  "building something mechanical with precision",
  "fighting a shadowy figure in the dark",
  "whispering secrets to a bird",
  "painting a masterpiece on a large canvas",
  "beat the drums",
  "waving energetically at the viewer",
  "summoning a glowing orb of light with a wave of the hand",
  "drawing runes in the air with a staff",
  "conjuring flames from their fingertips",
  "opening a portal to another dimension",
  "transforming into an animal in a swirl of magic",
  "teleporting in a flash of light",
  "floating above the ground in meditation",
  "creating illusions to confuse enemies",
  "using a crystal ball to foresee the future",
  "tinkering with a clock",
  "sharpening a blade meticulously",
  "studying a strange artifact closely",
  "blowing bubbles into the air",
  "catching fireflies in a jar",
  "puzzling over an ancient puzzle box",
  "mixing ingredients in a bubbling cauldron",
  "adjusting the sails on a small boat",
  "whittling a piece of wood into a figurine",
  "stringing a bow and preparing to shoot",
  "juggling brightly colored balls",
  "folding clothes neatly into a basket",
  "pouring a cup of hot coffee",
  "honing a piece of metal on a grinding wheel",
  "applying paint to a wall with long strokes",
  "blowing on hot soup to cool it",
  "tying a complex knot in a rope"
];

function getRandom(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

var newStyle = [];
function styleFilter() {
  for (var x = 0; x < style.length; x++) {
    if (promptsSourceInput[5][x] == true) {
      newStyle.push(style[x]);
    }
  }
}

function generatePrompt() {
  const randomStyle = getRandom(newStyle);
  const randomLight = getRandom(light);

  let randomSubject, randomDress, randomAction, randomScene;
  const imagination = promptsSourceInput[3][0];
  const rand = Math.random();

  if (imagination == 0) {
    if (rand < 0.75) {
      randomAction = getRandom(dailyActions);
      randomScene = getRandom(dailyScenes);
    } else {
      randomAction = getRandom(specialActions);
      randomScene = getRandom(specialScenes);
    }
  } else {
    randomAction = getRandom(dailyActions);
    randomScene = getRandom(dailyScenes);
  }

  if (rand < 0.1) {
    randomSubject = getRandom(animal);
    if (imagination == 0) {
      randomDress = Math.random() < 0.5 ? getRandom(maleDresses) : getRandom(femaleDresses);
    } else {
      randomDress = "";
      randomAction = "";
    }
  } else if (rand < 0.35) {
    randomSubject = getRandom(male);
    randomDress = getRandom(maleDresses);
  } else if (rand < 0.6) {
    randomSubject = getRandom(female);
    randomDress = getRandom(femaleDresses);
  } else if (rand < 0.8) {
    randomSubject = getRandom(job);
    if (Math.random() < 0.5) {
      randomDress = getRandom(maleDresses);
      randomSubject = "a male " + randomSubject;
    } else {
      randomDress = getRandom(femaleDresses);
      randomSubject = "a female " + randomSubject;
    }
  } else if (rand < 0.9) {
    randomSubject = getRandom(specialCharacters);
    randomDress = "";
  } else {
    randomSubject = getRandom(groupPerson);
    randomDress = "";
  }

  var imagetype = "";
  const w = randomDress == "" ? "" : " wearing ";
  if (promptsSourceInput[2][0] == 0) {
    if (imagination == 0) {
      imagetype = `${randomStyle}, ${randomLight}, ${randomSubject}${w}${randomDress}, ${randomAction}, in ${randomScene}.`;
    } else {
      imagetype = `${randomStyle}, ${randomSubject} ${randomAction}, in ${randomScene}.`;
    }
  } else {
    if (imagination == 0) {
      imagetype = `${randomStyle}, ${randomLight}, ${randomScene}.`;
    } else {
      imagetype = `${randomStyle}, ${randomScene}.`;
    }
  }
  if (promptsSourceInput[6][0] != "") {
    imagetype = promptsSourceInput[6][0] + ", " + imagetype;
  }
  return imagetype;
}

if (promptsSourceInput[1][0] == 1) {
  const randomPromptCount = promptsSourceInput[4][0];
  promptsSource = "";
  styleFilter();
  for (var x = 0; x < randomPromptCount; x++) {
    promptsSource += generatePrompt() + "\n\n";
  }
}

var buttonText = "Next";
if (promptsSourceInput[0][0] == 1) {
  buttonText = "🪄 Generate ";
}

const workflow = promptsSourceInput[0][0];
const configuration = pipeline.configuration;
var batchCount = configuration.batchCount;
var maxCount = 100;
if (batchCount > 100) {
  maxCount = batchCount;
}

var prompts = pipeline.prompts.prompt;
if (workflow == 0 || workflow == 1) {
  const promptsInput = requestFromUser(
    `Flux Auto Workflow ${version}`,
    buttonText,
    function () {
      return [
        this.section(
          "❖  Prompt Setting",
          "• Support multiple prompts batch generation, a blank line between each prompt.\n• Use ⬆︎ Shift + ↵ Enter to break line.",
          [
            this.textField(promptsSource, " Write your prompts here.", true, 420),
            this.slider(batchCount, this.slider.fractional(0), 1, maxCount, "❖    Batch count of each prompt"),
          ]
        ),
      ];
    }
  );
  prompts = promptsInput[0][0];
  batchCount = promptsInput[0][1];
}
const promptsArray = prompts.split('\n\n').filter(prompts => prompts.trim() !== '');
const promptsCount = promptsArray.length;

var start = Number;
function fluxModel() {
  var tip = `•   If you need a more accurate quantization model, please set 'useFlux8bit' to 'false'.`;
  if (useFlux8bit) {
    const isDownload = pipeline.areModelsDownloaded(["FLUX.1 [dev] (8-bit)"])
    if (!isDownload[0]) {
      tip = `•   After clicking Generate, FLUX.1 [dev] (8-bit) will be automatically downloaded, which requires about 14GB storage space. If you need a more accurate quantization model, please set 'useFlux8bit' to 'false' at the top of script.`;
    }
  }
  var titleInfo = "";
  if (workflow == 0) {
    titleInfo = `   ⎟   Prompts: ${promptsCount}  •  Images: ${batchCount * promptsCount}`;
  } else {
    titleInfo = `   ⎟   Image Refine Workflow`;
  }
  const userInputs = requestFromUser(
    `Flux Auto Workflow ${version}${titleInfo}`,
    generateText,
    function () {
      var widgetA;
      var widgetB;
      var d;
      if (workflow == 0) {
        d = 0;
        widgetA = this.section(
          "❖  Performance Mode",
          `• Speed Mode: Use the Dev to Schnell Lora to provide the fastest speed.\n• Balance Mode: Use Flux Dev as refiner to balance speed and quality.\n• Quality Mode: Use high steps to provide the best color and aesthetic style.`,
          [
            this.segmented(0, ["🚀  Speed   ", "⚖️  Balance   ", "🏆  Quality   "]),
          ]
        );
        widgetB = this.switch(false, "✡︎   Use New Seed");
      } else {
        d = 1;
        widgetA = this.section(
          "❖  Batch Refine",
          `• Select the image folder that needs to be refined in batches.\n⚠︎ All image size in the folder must be consistent, and the 'Image Size' above must be adjusted to the same size.`,
          [
            widgets = this.directory(),
          ]
        );
        widgetB = this.switch(false, "✡︎   Capture Image Description");
        tip = `•   After enabling the 'Capture Image Description' function, more perfect prompt can be provided for batch refine, making the refined image closer to the original image, but it will increase the running time and require the download of approximately 1.7GB of model files.`;
      }

      return [
        this.section(
          "❖  Image Size",
          "",
          [
            this.size(configuration.width, configuration.height, 128, 2048),
          ]
        ),
        widgetA,
        this.section(
          "❖  Detail Optimization",
          `• Standard Mode: helps to add more natural details and textures.\n• Enhance Mode: will add stronger contrast and the composition will change more.`,
          [
            this.segmented(d, ["📷  Standard   ", "📸  Enhance   "]),
          ]
        ),
        this.section(
          "❖  Other Settings",
          "",
          [
            this.switch(false, "✡︎   Keep Other Lora"),
            widgetB,
          ]
        ),
        this.section(
          "⚠︎  Tip",
          tip,
          []
        ),
      ];
    }
  );

  function calcShift(h, w) {
    const step1 = (h * w) / 256;
    const step2 = (1.15 - 0.5) / (4096 - 256);
    const step3 = (step1 - 256) * step2;
    const step4 = step3 + 0.5;
    const result = Math.exp(step4);
    return Math.round(result * 100) / 100;
  }

  const size = JSON.parse(JSON.stringify(userInputs[0][0]));
  const devShift = calcShift(size.height, size.width);
  const mode = userInputs[1][0];
  const detail = userInputs[2][0];
  const keepLora = userInputs[3][0];
  const newSeed = userInputs[3][1];
  const capture = userInputs[3][1];

  var loras = [];
  if (keepLora) {
    loras = configuration.loras;
  }

  if (newSeed == true && workflow == 0) {
    configuration.seed += 1;
  }

  if (useFlux8bit) {
    const isDownload = pipeline.areModelsDownloaded(["FLUX.1 [dev] (8-bit)", "FLUX.1 [dev] to [schnell] 4-Step"]);
    if (!isDownload[0]) {
      pipeline.downloadBuiltins(["FLUX.1 [dev] (8-bit)"]);
    }
    if (!isDownload[1]) {
      pipeline.downloadBuiltins(["FLUX.1 [dev] to [schnell] 4-Step"]);
    }
    configuration.model = "flux_1_dev_q5p.ckpt";
  } else {
    const isDownload = pipeline.areModelsDownloaded(["FLUX.1 [dev]", "FLUX.1 [dev] to [schnell] 4-Step"]);
    if (!isDownload[0]) {
      pipeline.downloadBuiltins(["FLUX.1 [dev]"]);
    }
    if (!isDownload[1]) {
      pipeline.downloadBuiltins(["FLUX.1 [dev] to [schnell] 4-Step"]);
    }
    configuration.model = "flux_1_dev_q8p.ckpt";
  }

  if ((configuration.width != size.width || configuration.height != size.height) && (workflow == 0)) {
    canvas.clear();
  }

  configuration.width = size.width;
  configuration.height = size.height;
  configuration.batchCount = 1;
  configuration.batchSize = 1;
  configuration.resolutionDependentShift = false;
  configuration.speedUpWithGuidanceEmbed = true;
  configuration.refinerModel = null;
  start = Date.now();

  if (workflow == 0) {
    const totalBatches = batchCount * promptsCount;
    for (var s = 0; s < promptsCount; s++) {
      for (var i = 0; i < batchCount; i++) {
        const completedBatches = batchCount * s + i + 1;
        const eTime = completedBatches > 1 ? estimateTime(start, completedBatches - 1, totalBatches) : ``;
        var schnellLora = [];
        if (loras.length > 0) {
          for (var x = 0; x < loras.length; x++) {
            const loraName = JSON.parse(JSON.stringify(loras[x]));
            if (loraName.file == "flux.1__dev__to__schnell__4_step_lora_f16.ckpt") {
              loras.splice(x, 1);
              x--;
            }
          }
        }
        if (mode == 0) {
          console.log(`🟢 Speed Mode ‣ Running the Flux Dev   ⚙︎ Image batch progress ‣ ${completedBatches}/${totalBatches}${eTime}`);
          schnellLora = loras;
          schnellLora.push({ "file": "flux.1__dev__to__schnell__4_step_lora_f16.ckpt", "weight": 1.0 });
          configuration.loras = schnellLora;
          configuration.sampler = 15;
          configuration.strength = 1.0;
          configuration.shift = 1.0;
          configuration.steps = 4;
          if (detail == 0) {
            configuration.guidanceScale = 3.5;
          } else {
            configuration.guidanceScale = 4.5;
          }
          pipeline.run({ configuration: configuration, prompt: promptsArray[s] });
        } else if (mode == 1) {
          console.log(`🟠 Balance Mode ‣ ❶ Running the Flux Dev    ⚙︎ Image batch progress ‣ ${completedBatches}/${totalBatches}${eTime} `);
          schnellLora = loras;
          schnellLora.push({ "file": "flux.1__dev__to__schnell__4_step_lora_f16.ckpt", "weight": 1.0 });
          configuration.loras = schnellLora;
          configuration.strength = 1.0;
          configuration.guidanceScale = 3.5;
          configuration.sampler = 15;
          configuration.shift = 1.0;
          configuration.steps = 4;
          pipeline.run({ configuration: configuration, prompt: promptsArray[s] });
          console.log(`🟠 Balance Mode ‣ ❷ Refining the image    ⚙︎ Image batch progress ‣ ${completedBatches}/${totalBatches}${eTime} `);
          if (detail == 0) {
            configuration.loras = [];
            configuration.sampler = 15;
            configuration.shift = devShift;
            configuration.guidanceScale = 3.0;
            configuration.strength = 0.35;
            configuration.steps = 20;
          } else {
            configuration.loras = [{ "file": "flux.1__dev__to__schnell__4_step_lora_f16.ckpt", "weight": 0.35 }];
            configuration.sampler = 10;
            configuration.shift = 1.0;
            configuration.guidanceScale = 3.8;
            configuration.strength = 0.5;
            configuration.steps = 8;
          }
          pipeline.run({ configuration: configuration, prompt: promptsArray[s] });
        } else if (mode == 2) {
          console.log(`🔴 Quality Mode ‣ Running the Flux Dev    ⚙︎ Image batch progress ‣ ${completedBatches}/${totalBatches}${eTime}`);
          configuration.sampler = 15;
          configuration.strength = 1.0;
          configuration.shift = devShift;
          if (detail == 0) {
            schnellLora = loras;
            schnellLora.push({ "file": "flux.1__dev__to__schnell__4_step_lora_f16.ckpt", "weight": 0.08 });
            configuration.loras = schnellLora;
            configuration.guidanceScale = 3.5;
            configuration.steps = 15;
          } else {
            configuration.loras = loras;
            configuration.guidanceScale = 3.5;
            configuration.steps = 20;
          }
          pipeline.run({ configuration: configuration, prompt: promptsArray[s] });
        }
        if (batchCount > 1) {
          configuration.seed += 1;
        }
      }
    }
  } else if (workflow == 2) {
    const imgFolder = userInputs[1][0];
    if (imgFolder == "") {
      const info = `Refining the image on the canvas`;
      refine(info);
    } else {
      canvas.updateCanvasSize(configuration)
      var imgFiles = filesystem.readEntries(imgFolder);
      const imgExt = /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i;
      imgFiles = imgFiles.filter(file => imgExt.test(file));
      if (imgFiles.length == 0) {
        console.log("⚠︎  No image file was found.");
        return
      }
      for (var i = 0; i < imgFiles.length; i++) {
        canvas.loadImage(imgFiles[i]);
        const eTime = i > 0 ? estimateTime(start, i, imgFiles.length) : ``;
        const info = `Refining the images from folder   ⚙︎ Image batch progress ‣ ${i + 1}/${imgFiles.length}${eTime}`;
        refine(info);
      }
    }
  }

  function refine(info) {
    let p = userInputs[1][0] == "" ? promptsArray[0] : "sharp focus, detailed texture, film particles, a high-quality image.";
    if (capture) {
      console.log(`🟢 Capturing Image Description ‣ Running the MoonDream  ⚠️ Please do not move the canvas and other operations while capturing the image description.`);
      const answer = canvas.answer("moondream2/20240520", "Describe this image, do not exceed 50 words.")
      if (answer) {
        p = answer;
      }
    }
    if (detail == 0) {
      console.log(`⚪️ Standard Mode ‣ ${info}`);
      configuration.loras = [];
      configuration.shift = devShift;
      configuration.sampler = 15;
      configuration.guidanceScale = 3.5;
      configuration.strength = 0.35;
      configuration.steps = 20;
    } else {
      console.log(`⚫️ Enhance Mode ‣ ${info}`);
      configuration.loras = [{ "file": "flux.1__dev__to__schnell__4_step_lora_f16.ckpt", "weight": 1.0 }];
      configuration.shift = 1.0;
      configuration.sampler = 10;
      configuration.guidanceScale = 1.0;
      configuration.strength = 0.8;
      configuration.steps = 5;
    }
    pipeline.run({ configuration: configuration, prompt: p });
  }
}

function otherModel() {
  start = Date.now();
  const totalBatches = batchCount * promptsCount;
  for (var s = 0; s < promptsCount; s++) {
    for (var i = 0; i < batchCount; i++) {
      const completedBatches = batchCount * s + i + 1;
      const eTime = completedBatches > 1 ? estimateTime(start, completedBatches - 1, totalBatches) : ``;
      console.log(`🟢 Running the Other Model   ⚙︎ Image batch progress ‣ ${completedBatches}/${totalBatches}${eTime}`);
      pipeline.run({ configuration: configuration, prompt: promptsArray[s] });
    }
    if (batchCount > 1) {
      configuration.seed += 1;
    }
  }
}

var generateText = "🪄 Generate ";
if (workflow == 0) {
  fluxModel();
} else if (workflow == 2) {
  generateText = "🪄 Refine ";
  fluxModel();
} else if (workflow == 1) {
  otherModel();
}

function estimateTime(totalStartTime, completedBatches, totalBatches) {
  const totalElapsedTime = Date.now() - totalStartTime;
  const averageTimePerBatch = totalElapsedTime / completedBatches;
  const remainingBatches = totalBatches - completedBatches;
  const estimatedRemainingTime = Math.floor(averageTimePerBatch * remainingBatches);
  const remainingMinutes = Math.floor(estimatedRemainingTime / 60000);
  const remainingSeconds = Math.floor((estimatedRemainingTime % 60000) / 1000).toString().padStart(2, '0');
  return `   ⏱ Remaining time ‣ ${remainingMinutes}:${remainingSeconds}`;
}

const end = Date.now();
const duration = end - start;
const minutes = Math.floor(duration / 60000);
const seconds = Math.floor((duration % 60000) / 1000).toString().padStart(2, '0');
console.log(`✔︎ Total time ‣ ${minutes}:${seconds}`);
