//@api-1.0
// v3.4
// Author: @czkoko
// This workflow will require two models Flux Dev and Dev to Schnell 4-Step lora at the same time. 
// Provide three different performance modes for users to choose from, optimized parameters, suitable for beginners.
// You only need to fill in the prompts and select the Performance Mode and Image Size. 

//
// Select the accuracy of the model. If you need a more accurate quantization model, please set this constant to `false`, and use Flux Dev (8-bit) by default.
//
const useFlux8bit = true;
//
// You can customize unlimited styles you like here, and the custom style is disabled by default.
//
const customStyle = [
  "Style of the movie \"The Grand Budapest Hotel\", by Wes Anderson",
  "Dynamic Marvel comic book layout with multiple scene transitions, rich character expressions, and storytelling through irregular panel design. Bold, graphic illustration with a strong visual hierarchy and narrative flow",
  "Hyper-realistic photography, Vibrant, saturated colors like electric pinks, greens, and yellows with sharp, high-contrast shadows. A bold, energetic style that feels modern and dynamic, reminiscent of pop art or street art",
];
//
//
//


const version = "v3.4";
var promptsSource = pipeline.prompts.prompt;

const promptsSourceInput = requestFromUser(
  `Flux Auto Workflow ${version}`,
  "Next",
  function () {
    return [
      this.section(
        "❖  Workflow Mode",
        " •   Flux Model: The optimization parameters will be set automatically for Flux.\n •   Other Model: SDXL, SD3, etc. Parameters need to be set manually.\n •   Image Refiner: Refine the existing image on the canvas automatically.",
        [
          this.segmented(0, ["🌊  Flux Model   ", "🧩  Other Model   ", "✨  Image Refiner   "]),
        ]
      ),
      this.section(
        "❖  Prompt Source",
        " •   Select the source of the prompt.",
        [
          this.segmented(0, ["📝  Custom Prompt   ", "🎲  Random Prompt   "]),
        ]
      ),
      this.section(
        "❖  Random Prompt • Quantity",
        " •   The number of random prompts to be generated.",
        [
          this.slider(10, this.slider.fractional(0), 1, 30, ""),
        ]
      ),
      this.section(
        "❖  Random Prompt • Creative Mode",
        " •   🅿: Program Automatic Mode, Automatic combination of style, subject, action, clothes, etc., more whimsical images.\n •   🆂: Subject Priority Mode, Action is matched by the model according to the subject and scene, which is relatively monotonous, but more natural.\n •   🅰: Action Priority Mode, Subject is matched by the model according to the action and scene, which is more vivid and natural.\n •   🅼: Manual Mode, You can manually combine the parts of the prompt.",
        [
          this.segmented(1, ["P", "S", "A", "M"]),
        ]
      ),
      this.section(
        "❖  Random Prompt • Manual Options  (🅼 Mode)",
        " •   Manually select parts of the prompt. Automatically match clothes based on the subject's gender.",
        [
          this.textField("", " {Subject}  Leave it blank to generate random scene without the subject.", false, 10),
          this.switch(false, "✡︎   Action"),
          this.switch(false, "✡︎   Clothes"),
          this.switch(true, "✡︎   Light"),
          this.switch(true, "✡︎   Scene")
        ]
      ),
      this.section(
        "❖  Random Prompt • Custom Prefix     (🅿 / 🆂 / 🅰 / 🅼 Mode)",
        " •   Add custom prefix to random prompts, such as the keyword to trigger LoRA.",
        [
          this.textField("", "keyword", false, 10),
        ]
      ),
      this.section(
        "❖  Random Prompt • Viewing Angle     (🅿 / 🆂 / 🅰 / 🅼 Mode)",
        " •   Auto: The model automatically selects the appropriate viewing angle.\n •   Random: Random selection from the list of viewing angle.",
        [
          this.menu(0, ["⏹️   Auto", "🔀   Random", "⏺️   Front View", "➡️   Side View", "⬇️   Top View", "↘️   Top-Down View", "↗️   Bottom View", "📷   GoPro"]),
        ]
      ),
      this.section(
        "❖  Random Prompt • Style Filter           (🅿 / 🆂 / 🅰 / 🅼 Mode)",
        " •   Filter the styles you don't need.\n •   The custom style can be set at the beginning of the source code.",
        [
          this.switch(true, "✡︎   Hasselblad Master Photography"),
          this.switch(true, "✡︎   Soft High-Key Photography"),
          this.switch(true, "✡︎   High-Fashion Portrait"),
          this.switch(true, "✡︎   Kodak Film Aesthetic"),
          this.switch(true, "✡︎   Orange-Teal Cinematic"),
          this.switch(true, "✡︎   Desaturated Cinematic"),
          this.switch(true, "✡︎   Vintage Cinematic"),
          this.switch(true, "✡︎   Retro Aesthetic Cinematic"),
          this.switch(true, "✡︎   Cold Fashion"),
          this.switch(true, "✡︎   Cold Steel Futurism"),
          this.switch(true, "✡︎   Dark Gothic Romance"),
          this.switch(true, "✡︎   Futuristic Noir Aesthetic"),
          this.switch(true, "✡︎   Opulent Baroque"),
          this.switch(true, "✡︎   Pastel Dreamscape"),
          this.switch(false, "✡︎   Conceptual Illustration"),
          this.switch(false, "✡︎   Mystical Fantasy"),
          this.switch(false, "✡︎   Pixar Cartoon Universe"),
          this.switch(false, "✡︎   Vibrant Anime"),
          this.switch(false, "✡︎   Custom")
        ]
      )
    ];
  }
);

const angle = [
  "front view",
  "side view",
  "top view",
  "top down view",
  "bottom view",
  "GoPro view"
];

const style = [
  "Hyper-realistic photography, captured with Hasselblad XCD, masterpieces of photography, sharp and intricate details, life-like textures, high-resolution clarity, and true-to-life colors",//Hasselblad Master Photography
  "Bright, white-dominant images with soft shadows and very subtle details. The focus is on high key lighting with minimal color, often in grayscale or with just a hint of pastel shades",//Soft High-Key Photography
  "Hyper-realistic photography, Bold lighting, sharp contrasts, and dramatic poses. Emphasizes luxury and glamour with sleek, polished visuals. Perfect for runway or fashion magazine aesthetics",//High-Fashion Portrait
  "Rich, vibrant colors with a slight warmth, with slightly saturated tones of red, yellow, and green. Subtle film grain adds texture. Captures the essence of classic Kodak color film",//Kodak Film Aesthetic
  "A vibrant cinematic palette with strong orange and teal tones. Fine film grain and gaussian noise add texture",//Orange-Teal Cinematic
  "Desaturated color palette with slight orange and blue undertones, shadow is very light. Fine film grain and gaussian noise to give a gritty, atmospheric quality",//Desaturated Cinematic
  "Grainy, low-saturation film aesthetics with soft textures and muted colors, evoking the look of old films. Faded tones and nostalgic, retro atmospheres, Fine film grain and gaussian noise add texture",//Vintage Cinematic
  "Symmetrical compositions with pastel and muted tones, often featuring warm yellows, soft pinks, and teal blues. Strong focus on meticulous framing, quirky characters, and vintage aesthetics. The style evokes a whimsical, nostalgic feel",//Retro Aesthetic Cinematic
  "Desaturated, cold color palette dominated by greys, muted blues, and browns. Minimal contrast, with a focus on bleak, overcast lighting and a sense of emptiness. Ideal for dark, minimalist fashion themes with a gritty edge",//Cold Fashion
  "A cool-toned, industrial palette dominated by metallic grays, blues, and muted whites. Sharp details and reflections give a sleek, futuristic appearance with a subtle, polished sheen",//Cold Steel Futurism
  "Deep reds, blacks, and purples, with an emphasis on dramatic shadows. The style creates a mysterious, romantic atmosphere, with a rich, almost baroque aesthetic",//Dark Gothic Romance
  "Dark, atmospheric visuals characterized by deep blues, vibrant oranges. Fine film grain and gaussian noise add texture. Cinematic compositions with a focus on shadows and reflections",//Futuristic Noir Aesthetic
  "Hyper-realistic photography, rich and warm colors with deep reds, golds, and dark shadows. Heavy textures, intricate details, and ornate patterns evoke the luxury and grandeur of baroque art",//Opulent Baroque
  "Soft pastel colors (pinks, light blues, lavender) blended with smooth gradients. Dreamy and surreal, often with a misty or glowing effect. Minimal contrast, focusing on soft, harmonious tones",//Pastel Dreamscape
  "Minimalist conceptual illustration, flat design with bold shapes, vibrant colors, and clean lines. Perfect for fashion ads, offering a trendy, modern look",//Conceptual Illustration
  "Ethereal 3D fantasy artwork with a vibrant color palette. Dreamy, whimsical worlds featuring purples, blues, and golds. Mystical elements evoke a magical, otherworldly atmosphere",//Mystical Fantasy
  "Bright, vibrant 3D cartoon artwork with a Pixar-inspired style. High attention to realistic details, smooth textures, and expressive characters",//Pixar Cartoon Universe
  "Dynamic anime art style with vibrant, saturated colors, detailed character designs, bold outlines, and lively, expressive scenes. A balance of stylization and realism"//Vibrant Anime
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
  "A young boy with straight blond hair and large, curious eyes",
  "A teen boy with braces, short curly hair, and shy eyes",
  "A teen boy with long, shaggy hair and acne on his cheeks",
  "A young man with short, buzzed hair and a sharp jawline",
  "A young man with a man-bun and a thin mustache",
  "A man in his 20s with wavy, medium-length hair and a clean-shaven face",
  "A man in his 20s with straight, parted hair and a light stubble",
  "A man in his early 20s with medium-length curly hair and a square jawline",
  "A man in his late 20s with a trimmed beard and a confident stance",
  "A man in his 30s with short, styled hair and a prominent chin",
  "A man in his 30s with a shaved head and a full beard",
  "A man in his 30s with close-cropped hair and prominent cheekbones",
  "A man in his 40s with slightly graying hair and laugh lines around his eyes",
  "A man in his 40s with a receding hairline and a square jaw",
  "A man in his 40s with a short beard and a scar over his left eyebrow",
  "A middle-aged man with thick glasses, a mustache, and thinning hair",
  "A middle-aged man with shoulder-length hair tied back and a rugged face",
  "A man in his 50s with salt-and-pepper hair and a strong brow",
  "A man in his 50s with a balding crown and a goatee",
  "A man in his 50s with thinning gray hair and a pair of reading glasses",
  "An older man with a full head of white hair and a bushy mustache",
  "An older man with a long beard and deep-set eyes",
  "An elderly man with a bald head, deep wrinkles, and kind eyes",
  "An elderly man with wispy white hair and sunken cheeks",
  "A very old man with a stooped posture, thin white hair, and a gentle smile",
  "A man in his 60s with a gray beard and a weathered face",
  "A man in his 60s with slicked-back gray hair and a stern expression",
  "A man in his 60s with a long, white ponytail and a weathered face",
  "A man in his 70s with a bald head, a prominent nose, and kind eyes",
  "A man in his 70s with white hair combed to the side and a trimmed beard",
  "A man in his 70s with a clean-shaven face, liver spots, and a gentle expression",
  "An elderly man with a full white beard and a wrinkled, leathery face",
  "An elderly man with sparse white hair, a wrinkled forehead, and bright, sharp eyes"
];

const female = [
  "A little girl",
  "A young woman",
  "A middle-aged woman",
  "An elderly woman",
  "A little girl with short, straight hair and rosy cheeks",
  "A little girl with curly pigtails and big, wide eyes",
  "A little girl with wavy, dark hair and large, expressive eyes",
  "A little girl with a bob cut and dimples on her cheeks",
  "A young girl with long, braided hair and a bright smile",
  "A teenage girl with dyed pink hair and round glasses",
  "A teenage girl with shoulder-length wavy hair and freckles",
  "A teenage girl with straight, black hair and sharp features",
  "A young woman with long, flowing hair and high cheekbones",
  "A young woman with a pixie cut and a playful smile",
  "A woman in her 20s with short, bobbed hair and soft eyes",
  "A woman in her 20s with thick, curly hair and an oval face",
  "A young woman in her early 20s with short, spiked hair and hoop earrings",
  "A young woman in her late 20s with sleek, straight hair and almond-shaped eyes",
  "A woman in her 30s with medium-length hair and a few wrinkles around her eyes",
  "A woman in her 30s with long, straight hair and a confident expression",
  "A woman in her 30s with shoulder-length curls and a soft, relaxed expression",
  "A middle-aged woman with shoulder-length wavy hair and laugh lines",
  "A middle-aged woman with a high ponytail and tired eyes",
  "A woman in her 40s with graying hair and a warm smile",
  "A woman in her 40s with short hair and a strong jawline",
  "A woman in her 40s with sharp features, high cheekbones, and a few gray strands",
  "A woman in her 50s with shoulder-length hair and slight crow's feet",
  "A woman in her 50s with a curly bob and a gentle expression",
  "A woman in her 50s with a graying bob, thin eyebrows, and a gentle smile",
  "An older woman with a bun of white hair and a round, wrinkled face",
  "An older woman with long, graying hair and a serene expression",
  "An elderly woman with thin white hair and deep wrinkles around her mouth",
  "An elderly woman with short, curly hair and sunken cheeks",
  "A very old woman with her hair in a tight bun and soft, kind eyes",
  "A woman in her 60s with a bob of silver hair and a proud posture",
  "A woman in her 60s with long, silver hair tied in a braid and laugh lines",
  "A woman in her 70s with long, white hair and a gentle smile",
  "A woman in her 70s with short white curls, a wrinkled forehead, and a bright expression",
  "An elderly woman with a long white braid, prominent cheekbones, and warm eyes",
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

const maleClothes = [
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

const femaleClothes = [
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

const maleName = [
  "Xiao Dong",
  "Xiao Bin",
  "Kenta",
  "Hideto",
  "Son Kang-Dae",
  "Thi Tạ Hiền",
  "Pan Aduladej",
  "Pruitt Villeneuve",
  "Friedrick Brackmann",
  "Pietro Caponera",
  "Jasper Bergquist",
  "Tomas Rosten",
  "Pouya Hosseini",
  "Nikolaev",
  "Dequinn Harrell"
];

const femaleName = [
  "Xiao Na",
  "Xiao Han",
  "Mikami",
  "Kanako",
  "Ha Yun-Soo",
  "La Ngọc Lý",
  "Tidarat Taksin",
  "Vignetta Badour",
  "Leota Zobel",
  "Fabia Santomauro",
  "Elsa Widforss",
  "Helena Hoel",
  "Anna Qaedi",
  "Lidochka Vasilev",
  "Xemena Porter"
];

const dailyScenes = [
  "A quiet suburban neighborhood",
  "A cozy cafe on a rainy afternoon",
  "A modern apartment with floor-to-ceiling windows",
  "A bustling farmers market",
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
  "A minimalist, monochromatic urban neighborhood with tall, sleek buildings fading into misty horizons",
  "A warm, golden-hued cafe with soft glowing lights and rain-soaked windows that reflect streaks of neon",
  "An ultra-modern apartment with oversized geometric windows, the city skyline blurred and refracted through glass prisms",
  "A suburban street, adorned with extravagant holiday decorations, but transformed into a dreamy, ethereal display of glowing orbs and shimmering",
  "A foggy forest where towering trees merge into abstract lines, and beams of sunlight pierce through in soft",
  "A desert landscape with massive, abstract dunes sculpted by the wind, the sand reflecting iridescent colors under a deep blue sky",
  "A Parisian street at dawn, while iconic rooftops and wrought-iron balconies create a timeless, romantic atmosphere",
  "A lush, tropical rainforest, the dense foliage illuminated by shafts of sunlight that create patterns of light and shadow",
  "A minimalist white wall in the centre of the room features wood framed artwork, a contemporary leather chair and a black stone coffee table",
  "A muted green room with a textured wallpaper, showcasing a round wooden table and a vintage armchair",
  "An elegant cream-colored room featuring a large mirror, a marble side table, and a decorative plant in the corner",
  "An industrial kitchen with exposed brick walls, showcasing a stainless steel island and simple wooden stools",
  "A serene yoga studio with light gray walls, featuring a wall of mirrors, yoga mats neatly arranged, and natural wood benches",
  "A sleek bathroom with deep navy tiles, showcasing a freestanding tub, a minimalist vanity, and a touch of greenery in the corner",
  "An outdoor patio with warm wooden decking, featuring simple lounge chairs and a low table surrounded by lush greenery",
  "A tranquil meditation room with soft beige walls, a small altar, and a few cushions arranged on the floor",
  "A cozy bedroom with pastel walls, featuring a low platform bed and a minimalist bedside table",
  "A clean-lined workshop with gray walls, showcasing tools neatly organized on pegboards and a sturdy workbench in the center",
  "A chic hair salon with white walls, featuring minimalist styling stations and a simple waiting area adorned with plants",
  "A bright and airy sunroom with glass walls, featuring a small table and chairs, surrounded by indoor plants",
  "A spacious garage with white walls, featuring organized storage shelves and a central workbench",
  "A modern greenhouse with clear glass panels, showcasing neatly arranged potted plants and a simple seating area for plant enthusiasts",
  "A minimalist classroom with soft blue walls, featuring simple desks arranged in rows and a chalkboard at the front",
  "An extremely dark room with the shadow of the window projected on the ground",
  "front of the background of fashionable Morandi style color-blocking",
  "front of the background of fashionable Morandi style solid color",
  "front of the background of fashionable minimalist, youthful and energetic color matching",
  "front of the background of white columns, with long shadows",
  "front of the background of black and white stitching",
  "front of the background of black and white light and shadow",
  "front of the background of minimalist landscape of intersecting black and white lines, creating geometric shapes that seem to float in a stark, infinite white space",
  "front of the background of abstract composition of overlapping translucent circles in pastel hues",
  "front of the background of futuristic grid of perfect cubes and spheres, suspended in a glowing space where each shape casts sharp shadows",
  "front of the background of deconstructed cityscape made entirely of sharp, angular triangles and rectangles, each surface reflecting metallic or matte textures in varying shades of gray",
  "front of the background of surreal space of floating, interconnected rings and lines, each element glowing softly in pastel neon colors",
  "front of the background of series of stacked, monochromatic cubes in various sizes, arranged in a staggered pattern, creating depth and a sense of organized chaos against a neutral backdrop",
  "front of the background of minimalist design of smooth, continuous lines that form abstract, flowing shapes, suspended in midair, evoking a sense of balance and harmony in motion",
  "front of the background of soft, ethereal blend of thin, interweaving lines and geometric shapes, all in muted pastel tones, creating a feeling of serene complexity and delicate balance",
  "front of the background of seamless pattern of concentric circles and sharp intersecting lines, all in grayscale, creating an optical illusion of depth and movement",
  "front of the background of minimalist composition of floating, translucent squares and rectangles, where each shape subtly overlaps and shifts",
  "front of the background of intricate web of crisscrossing, neon-colored lines, forming geometric shapes that pulse with soft glows against a dark",
  "front of the background of three-dimensional spiral of interlocked, metallic polygons, where light plays across the surfaces"
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
  "A ghostly ship",
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
  "planting seeds carefully into the soil",
  "Riding on the back of a lion",
  "Riding on a horse",
  "Riding on the back of a tiger",
  "Crubbing a puppy",
  "Holding a puppy",
  "Running with a golden retriever",
  "Crubbing a kitten",
  "Holding a black kitten",
  "Eating a huge hamburger",
  "Raising a beer",
  "Crying with tears in his eyes",
  "Laughing happily with the scissors sign",
  "Dragging his chin in thought",
  "Having an angry expression",
  "Having a smirking expression",
  "Having a smug expression",
  "Sitting on a bench with crossed legs",
  "Lying down with arms behind the head",
  "Clapping hands enthusiastically",
  "Blowing a kiss",
  "Scratching the head in confusion",
  "Dancing with both hands up",
  "Sitting cross-legged on the ground",
  "Walking confidently with a briefcase",
  "Taking a selfie",
  "Winking with one eye",
  "Covering mouth in surprise",
  "Yawning with wide-open mouth",
  "Throwing a paper airplane",
  "Shivering in the cold",
  "Sweating in the heat",
  "Nodding in agreement",
  "Shrugging with palms up",
  "Blowing bubbles",
  "Holding a bouquet of flowers"
];

const specialActions = [
  "exploring an ancient map",
  "casting a powerful spell",
  "floating weightlessly in mid-air",
  "whispering secrets to a bird",
  "painting a masterpiece on a large canvas",
  "beat the drums",
  "waving energetically at the viewer",
  "summoning a glowing orb of light with a wave of the hand",
  "conjuring flames from their fingertips",
  "opening a portal to another dimension",
  "teleporting in a flash of light",
  "floating above the ground in meditation",
  "using a crystal ball to foresee the future",
  "catching fireflies in a jar",
  "mixing ingredients in a bubbling cauldron",
  "adjusting the sails on a small boat",
  "whittling a piece of wood into a figurine",
  "stringing a bow and preparing to shoot",
  "juggling brightly colored balls",
  "arm wrestling with the Hulk",
  "playing chess with a robot",
  "having a tea party with a dragon",
  "baking a cake with Spider-Man",
  "doing yoga alongside Wonder Woman",
  "reading a comic book with Iron Man",
  "riding a bicycle with Superman",
  "playing hopscotch with Thor",
  "taking selfies with a vampire",
  "practicing magic tricks with Doctor Strange",
  "playing a banjo for an audience of ghosts",
  "fencing with a pirate captain",
  "having a dance-off with a zombie",
  "feeding a pet unicorn",
  "having a pillow fight with Batman",
  "doing karaoke with Captain America",
  "building a giant banana with Minions",
  "getting into a pie fight with Minions",
  "dancing a conga line with Minions",
  "trying on costumes with Minions",
  "riding a unicycle with a Minion holding balloons",
  "helping Gru plan a heist with Minions",
  "playing freeze tag with Olaf from Frozen",
  "having a bubble-blowing contest with SpongeBob",
  "eating jellybeans with Toothless the dragon",
  "watching fireworks with Baymax",
  "teaching Pikachu how to cook pancakes",
  "going on a treasure hunt with Jack Sparrow"
];

function getRandom(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

var newStyle = [];
function styleFilter() {
  for (var x = 0; x < style.length; x++) {
    if (promptsSourceInput[7][x] == true) {
      newStyle.push(style[x]);
    }
  }
  if (promptsSourceInput[6][style.length] == true) {
    newStyle.push(...customStyle);
  }
}

function generatePrompt() {
  const randomStyle = getRandom(newStyle);
  var randomLight = getRandom(light);

  let randomSubject, randomClothes, randomAction, randomScene;
  const creativeMode = promptsSourceInput[3][0];
  const rand = Math.random();
  if (0 < creativeMode < 3) {
    randomLight = "";
  }
  if (rand < 0.85) {
    randomAction = getRandom(dailyActions);
    randomScene = getRandom(dailyScenes);
  } else {
    randomAction = getRandom(specialActions);
    randomScene = getRandom(specialScenes);
  }

  if (rand < 0.1) {
    randomSubject = getRandom(animal);
    if (creativeMode == 0 || creativeMode == 3) {
      randomClothes = Math.random() < 0.5 ? getRandom(maleClothes) : getRandom(femaleClothes);
    } else {
      randomClothes = "";
    }
  } else if (rand < 0.35) {
    randomSubject = getRandom(male);
    randomClothes = getRandom(maleClothes);
    if (Math.random() < 0.4) {
      const name = getRandom(maleName);
      randomSubject += " named \"" + name + "\"";
    }
  } else if (rand < 0.6) {
    randomSubject = getRandom(female);
    randomClothes = getRandom(femaleClothes);
    if (Math.random() < 0.4) {
      const name = getRandom(femaleName);
      randomSubject += " named \"" + name + "\"";
    }
  } else if (rand < 0.85) {
    randomSubject = getRandom(job);
    if (Math.random() < 0.5) {
      randomClothes = getRandom(maleClothes);
      randomSubject = "a male " + randomSubject;
      if (Math.random() < 0.4) {
        const name = getRandom(maleName);
        randomSubject += " named \"" + name + "\"";
      }
    } else {
      randomClothes = getRandom(femaleClothes);
      randomSubject = "a female " + randomSubject;
      if (Math.random() < 0.4) {
        const name = getRandom(femaleName);
        randomSubject += " named \"" + name + "\"";
      }
    }
  } else if (rand < 0.95) {
    randomSubject = getRandom(specialCharacters);
    randomClothes = "";
  } else {
    randomSubject = getRandom(groupPerson);
    randomClothes = "";
  }

  if (creativeMode == 3) {
    if (promptsSourceInput[4][0] != "") {
      randomSubject = promptsSourceInput[4][0];
      const man = ["man", "boy", "guy", "gentleman", "male", "husband", "father", "son", "brother", "uncle", "grandfather"];
      const woman = ["woman", "girl", "lady", "female", "wife", "mother", "daughter", "sister", "aunt", "grandmother"];
      const words = randomSubject.toLowerCase().split(" ");
      const isMan = words.some(word => man.includes(word));
      const isWoman = words.some(word => woman.includes(word));

      if (isMan) {
        randomClothes = getRandom(maleClothes);
      } else if (isWoman) {
        randomClothes = getRandom(femaleClothes);
      } else {
        randomClothes = Math.random() < 0.5 ? getRandom(maleClothes) : getRandom(femaleClothes);
      }

      if (promptsSourceInput[4][1] == false) {
        randomClothes = "";
      }
      if (promptsSourceInput[4][2] == false) {
        randomAction = "";
      }
      if (promptsSourceInput[4][3] == false) {
        randomLight = "";
      }
      if (promptsSourceInput[4][4] == false) {
        randomScene = "";
      }
    } else {
      randomSubject = "";
      randomClothes = "";
      randomAction = "";
    }
  }

  var view = "";
  if (promptsSourceInput[6][0] > 1) {
    view = angle[promptsSourceInput[6][0] - 2];
  } else if (promptsSourceInput[6][0] == 1) {
    view = getRandom(angle);
  }

  const w = randomClothes == "" ? "" : " wearing ";
  const i = randomSubject == "" ? "" : "in ";
  var buildPrompt = "";
  switch (creativeMode) {
    case 0:
      buildPrompt = `${randomStyle}, ${view}, ${randomLight}, ${randomSubject}${w}${randomClothes}, ${randomAction} in ${randomScene}.`;
      break;
    case 1:
      buildPrompt = `${randomStyle}, ${view}, ${randomLight}, ${randomSubject}${w}${randomClothes} in ${randomScene}.`;
      break;
    case 2:
      buildPrompt = `${randomStyle}, ${view}, ${randomLight}, someone ${randomAction} in ${randomScene}.`;
      break;
    case 3:
      buildPrompt = `${randomStyle}, ${view}, ${randomLight}, ${randomSubject}${w}${randomClothes}, ${randomAction} ${i}${randomScene}.`;
      break;
    default:
      buildPrompt = `${randomStyle}, ${view}, ${randomLight}, ${randomSubject}${w}${randomClothes}, ${randomAction} in ${randomScene}.`;
  }

  if (promptsSourceInput[5][0] != "") {
    buildPrompt = promptsSourceInput[5][0] + ", " + buildPrompt;
  }
  return buildPrompt.split(', ,').join('');
}

if (promptsSourceInput[1][0] == 1) {
  const randomPromptCount = promptsSourceInput[2][0];
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
          " •   Support multiple prompts batch generation, a blank line between each prompt.\n •   Use ⬆︎ Shift + ↵ Enter to break line. iPadOS / iOS requires an external keyboard.",
          [
            this.textField(promptsSource, " Write your prompts here.", true, 420),
            this.slider(batchCount, this.slider.fractional(0), 1, maxCount, "❖  Batch count of each prompt"),
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
  var tip = ` •   If you need a more accurate quantization model, please set 'useFlux8bit' to 'false'.`;
  if (useFlux8bit) {
    const isDownload = pipeline.areModelsDownloaded(["FLUX.1 [dev] (8-bit)"])
    if (!isDownload[0]) {
      tip = ` •   After clicking Generate, FLUX.1 [dev] (8-bit) will be automatically downloaded, which requires about 14GB storage space. If you need a more accurate quantization model, please set 'useFlux8bit' to 'false' at the top of script.`;
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
          ` •   Speed Mode: Use the Dev to Schnell LoRA to provide the fastest speed.\n •   Balance Mode: Use Flux Dev as refiner to balance speed and quality.\n •   Quality Mode: Use high steps to provide the best color and aesthetic style.`,
          [
            this.segmented(0, ["🚀  Speed   ", "⚖️  Balance   ", "🏆  Quality   "]),
          ]
        );
        widgetB = this.switch(false, "✡︎   Keep Control");
      } else {
        d = 1;
        widgetA = this.section(
          "❖  Batch Refine",
          ` •   Select the image folder that needs to be refined in batches.\n⚠︎   All image size in the folder must be consistent, and the 'Image Size' above must be adjusted to the same size.`,
          [
            widgets = this.directory(),
          ]
        );
        widgetB = this.switch(false, "✡︎   Capture Image Description");
        tip = ` •   After enabling the 'Capture Image Description' function, more perfect prompt can be provided for batch refine, making the refined image closer to the original image, but it will increase the running time and require the download of approximately 1.7GB of model files.`;
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
          ` •   Standard Mode: helps to add more natural details and textures.\n •   Enhance Mode: will add stronger contrast and the composition will change more.`,
          [
            this.segmented(d, ["📷  Standard   ", "📸  Enhance   "]),
          ]
        ),
        this.section(
          "❖  Additional Model Settings",
          " •   Make sure the LoRA and Control models are compatible with Flux before enabling.",
          [
            this.switch(false, "✡︎   Keep LoRA"),
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
  const keepControl = userInputs[3][1];
  const capture = userInputs[3][1];

  var loras = [];
  if (keepLora) {
    loras = configuration.loras;
  }

  var controls = [];
  if (keepControl) {
    controls = configuration.controls;
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
  configuration.clipSkip = 1;
  configuration.resolutionDependentShift = false;
  configuration.speedUpWithGuidanceEmbed = true;
  configuration.tiledDiffusion = false;
  configuration.hiresFix = false;
  configuration.upscaler = null;
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
          schnellLora.push({ "file": "flux.1__dev__to__schnell__4_step_lora_f16.ckpt", "weight": 1.1 });
          configuration.loras = schnellLora;
          configuration.controls = controls;
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
          schnellLora.push({ "file": "flux.1__dev__to__schnell__4_step_lora_f16.ckpt", "weight": 1.1 });
          configuration.loras = schnellLora;
          configuration.controls = controls;
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
          configuration.controls = [];
          pipeline.run({ configuration: configuration, prompt: promptsArray[s] });
        } else if (mode == 2) {
          console.log(`🔴 Quality Mode ‣ Running the Flux Dev    ⚙︎ Image batch progress ‣ ${completedBatches}/${totalBatches}${eTime}`);
          configuration.controls = controls;
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
    configuration.controls = [];
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
