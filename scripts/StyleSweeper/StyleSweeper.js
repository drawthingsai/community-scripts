//@api-1.0
/*
  The Modular Creative Toolkit (UI Edition)
  Dale Francis Reding - May 23, 2026
  Refactored: Professional Workflow Organization
  Status: Developmental


  PURPOSE:
  A professional-grade style sweeping engine for exploring high-fidelity visual 
  treatments across specific creative disciplines. Use this tool to find a 
  style that works with your image concept, and then explore that aesthetic 
  in more detail separately. Note it you set the number of runs to more than
  one then each style will be run multiple times.  
  
  DEVELOPMENT:
  Developed using existing community scripts for references, and Google Gemini,
  NotebookLM, Perplexity, Claude and Coplilot for coding, style development
  and refinements.
*/

// ==========================================
// 1. STYLE BLOCKS (The 11 Pillars)
// ==========================================

// --- GROUP I: VISUAL ARTS ---


// 1. PHOTOGRAPHY & CINEMATIC
const blockPhotography = [
  "cinematic film still {prompt} 35mm photograph, Panavision lens, shallow depth of field, moody lighting, bokeh, cinemascope, epic scale, heavy film grain",
  "film noir style {prompt} 1940s cinematic style, monochrome, high contrast lighting, dramatic chiaroscuro shadows, mysterious atmospheric lighting, classic noir aesthetic",
  "neon noir {prompt} cyberpunk optical aesthetic, wet reflective surfaces, glowing neon illumination, high contrast rim lighting, low light night photography, vibrant cinematic colors",
  "analog film photo {prompt} 35mm point and shoot, faded Kodachrome film stock, light leaks, heavy grain, vignette, vintage snapshot optical quality, Lomography, stained print",
  "Polaroid instant photo {prompt} soft focus, blown-out highlights, faded colors, nostalgic retro optical aesthetic, direct flash lighting",
  "disposable camera photo {prompt} harsh direct flash, red-eye effect lighting, dark vignette, raw candid amateur aesthetic, 1990s flash photography",
  "HDR photo of {prompt} high dynamic range, tone mapped, hyper-realistic, vivid colors, rich details, crisp shadows and highlights, intense enhanced contrast, 8k resolution",
  "long exposure photo of {prompt} slow shutter speed, blurred motion, smooth light trails, surreal, dreamy atmosphere, ethereal ghosting effect, tripod shot, highly detailed",
  "macro photography {prompt} 100mm macro lens, sharp focus on intricate microscopic details, extreme close-up, creamy bokeh background, ring light illumination",
  "tilt-shift photo of {prompt} selective focus lens, miniature diorama depth of field effect, blurred foreground and background, vibrant colors, elevated perspective",
  "infrared photography {prompt} Kodak Aerochrome film aesthetic, surreal false-color infrared, vibrant crimson and pink highlights, high contrast, ethereal atmosphere",
  "drone photography {prompt} DJI Mavic Pro camera, extreme top-down bird's eye view, geometric composition, high altitude perspective, 4k crisp resolution",
  "knolling photography {prompt} flat lay, perfectly organized arrangement, precise 90 degree overhead angle, crisp studio lighting, clean background, highly detailed",
  "silhouette style {prompt} heavily backlit, deep black shadows against bright background, high contrast, minimalistic composition, stark dramatic lighting",
  "studio photography {prompt} crisp seamless backdrop, Profoto strobe lighting, professional studio setup, sharp focus, medium format camera, highly detailed",
  "glamorous photo {prompt} high-end editorial style, sensual elegance, dramatic studio lighting, professional retouching, stunning clarity, luxurious illumination",
  "boudoir photography {prompt} soft diffused window lighting, elegant romantic and intimate atmosphere, soft focus, tasteful editorial composition",
  "iphone photo {prompt} computational photography, deep depth of field, natural lighting, candid everyday snapshot, high sharpness, mobile photography camera aesthetic",
  "astrophotography {prompt} deep space astrophotography aesthetic, starry night lighting, long exposure cosmos style, high ISO, glowing atmospheric background",
  "underwater photography {prompt} underwater optical aesthetic, caustic light rays refracting, deep blue atmospheric tint, suspended particles, aquatic lighting",
  "black and white landscape {prompt} Ansel Adams style, majestic high contrast monochrome, large format camera aesthetic, dramatic lighting, sharp focus, f/16 aperture",
  "golden hour landscape {prompt} sweeping panoramic framing, warm amber lighting, long shadows, wide angle lens, highly detailed, serene golden hour light",
  "blue hour landscape {prompt} twilight photography, deep blue atmospheric lighting, pre-dawn calm, soft diffused light, cool color palette, tranquil ambient atmosphere",
  "wildlife photography {prompt} National Geographic style, 400mm telephoto lens compression, shallow depth of field, sharp focus on subject, vibrant, documentary realism",
  "blue hour cityscape {prompt} twilight architectural photography, modern sleek lighting, transition to night, wide angle lens, highly detailed, cool ambient illumination",
  "long exposure city night {prompt} urban long exposure aesthetic, smooth light trails, tripod shot, slow shutter speed, glowing vibrant ambient night lights",
  "moonlit rural landscape {prompt} cool silvery moonlight, serene nocturnal atmosphere, dark silhouettes, unpolluted night lighting, peaceful shadows",
  "light painting photography {prompt} long exposure night photography, glowing light trails drawn in the air, dark background, creative illuminated movement, tripod shot",
  "street photography {prompt} candid snapshot, 35mm lens, Henri Cartier-Bresson style, decisive moment, realistic, raw, unposed, natural environmental lighting",
  "photojournalism {prompt} Pulitzer prize winning photography aesthetic, raw emotional impact, documentary realism, gritty, high contrast narrative focus, unedited truth",
  // ADDED RESTORED ANTIQUE STYLE
  // For light/porcelain complexions
  "restored antique studio portrait (cool tint) {prompt} pristine vintage 1920s photograph, highly detailed photographic base, very subtle translucent hand-tinting, flawless smooth porcelain skin, dark atmospheric studio vignette, historical photographic realism",
  // For rich/dark complexions
  "restored antique studio portrait (warm tint) {prompt} pristine vintage 1920s photograph, highly detailed photographic base, exquisite translucent hand-tinting, honoring rich natural skin tones, warm sepia undertones, flawless smooth complexion, dark atmospheric studio vignette, historical photographic realism, no blue color cast"
];

// 2. FINE ART & PAINTING
const blockFineArt = [
  "watercolor painting {prompt} wet-on-wet technique, cold press paper texture, translucent color washes, Winsor & Newton style, soft blending, painterly",
  "vintage oil painting {prompt} heavy impasto texture, visible canvas weave, thick brushstrokes, classical chiaroscuro, rich deep tones, museum masterpiece",
  "Rembrandt style painting {prompt} 17th century Dutch Golden Age, dramatic single-source chiaroscuro lighting, deep enveloping shadows, warm earthy oil tones, thick impasto highlights, highly detailed museum masterpiece",
  "Vermeer style painting {prompt} 17th century Dutch Golden Age masterpiece, profound atmospheric stillness, meticulous optical precision, soft luminous daylight, camera obscura depth of field with sharp pointillé light dots, highly textured realistic surfaces, signature rich lapis lazuli blues and lead-tin yellows, timeless serenity",
  "Henry Ripplinger style painting {prompt} highly detailed folk-realism, dramatic sweeping light, nostalgic and serene atmosphere, sharp focus, vibrant yet natural color palette, fine art aesthetic",
  "acrylic painting {prompt} bold vibrant colors, smooth matte finish, modern painterly style, layered flat colors, fluid brushwork, contemporary fine art",
  "gouache illustration {prompt} opaque watercolor, flat areas of color, velvety matte finish, crisp illustrative style, vintage commercial art",
  "fresco painting {prompt} cracked aged plaster, faded ancient pigments, buon fresco technique, classical Italian aesthetic, muted earth tones",
  "egg tempera painting {prompt} fine luminous crosshatching, wooden panel texture, medieval and early renaissance style, highly detailed layer work",
  "encaustic painting {prompt} hot wax medium, heavily textured surface, translucent layers, organic tactile feel, ancient artistic technique",
  "pencil sketch {prompt} HB graphite texture, precise crosshatching, Moleskine sketchbook page, smudged shading, highly detailed precise linework",
  "charcoal drawing {prompt} willow charcoal, dark velvety tones, heavy smudged texture, dramatic high contrast, kneaded eraser highlights, expressive",
  "pastel drawing {prompt} soft chalk texture, Edgar Degas style, muted powdery colors, smudged lines, delicate strokes on textured paper",
  "colored pencil art {prompt} Prismacolor style, rich burnished layers, fine hatching, waxy pigment texture, visible paper grain",
  "ballpoint pen art {prompt} blue ink, dense crosshatching, Biro sketch, high contrast, meticulous highly detailed linework",
  "ink drawing {prompt} bold India ink lines, high contrast black and white, dip pen illustration, dripping ink detail, expressive hatching",
  "marker drawing {prompt} Copic alcohol markers, smooth Bristol board, vibrant flat color areas, precise professional rendering style, bold clean marker lines",
  "Japanese ink drawing {prompt} sumi-e style, inkwash, minimalist flowing brushstrokes, monochrome, rice paper texture, highly detailed",
  "woodcut print {prompt} traditional relief printing, bold graphic black and white, carved wood grain texture, stark high contrast, medieval printmaking",
  "ukiyo-e woodblock print {prompt} traditional Japanese aesthetic, Edo period block printing technique, flat bold colors, distinct flowing outlines, crisp ink registration",
  "scratchboard art {prompt} high contrast engraving, fine white lines scraped on black ink board, meticulous crosshatching, hyper-detailed illustration",
  "renaissance style {prompt} Italian High Renaissance, da Vinci and Raphael style, realistic perspective, sfumato technique, classical proportions, highly detailed oil painting",
  "baroque art {prompt} Caravaggio style, dramatic chiaroscuro lighting, deep shadows, ornate details, rich oil colors, grand theatrical scale",
  "rococo art {prompt} Fragonard style, pastel colors, playful, highly ornate, asymmetrical curves, gilded elegance, lighthearted and airy oil painting",
  "neoclassicism art {prompt} Jacques-Louis David style, clarity of form, harmonious, idealized beauty, inspired by Roman and Greek antiquity, stark lighting",
  "romanticism art {prompt} Caspar David Friedrich style, intense emotion, sublime atmosphere, dramatic scale, sweeping expressive brushstrokes, heroic and passionate lighting",
  "pre-raphaelite art {prompt} John Everett Millais style, luminous jewel tones, hyper-detailed realistic textures, romantic and intense atmosphere, meticulous brushwork, stunning fine art oil painting",
  "impressionism {prompt} Claude Monet style, loose visible brushwork, vibrant color palette, en plein air lighting, capturing fleeting light and shadow",
  "post-impressionism {prompt} Vincent van Gogh style, thick impasto brushstrokes, bold unnatural colors, expressive swirling skies, emotional weight",
  "pointillism style {prompt} Georges Seurat style, neo-impressionism, composed entirely of small distinct dots of pure color, vibrant optical blending",
  "art nouveau style {prompt} Alphonse Mucha and Gustav Klimt style, elegant decorative borders, curvilinear whiplash forms, nature-inspired motifs, gold leaf, ornate",
  "fauvism art {prompt} Henri Matisse style, wild beast painterly strokes, bold clashing colors, textured brushwork, vivid non-naturalistic palette",
  "expressionism art style {prompt} Edvard Munch style, psychological distortion, thick impasto, high contrast, anxious emotional energy, exaggerated sharp forms",
  "cubism art {prompt} Pablo Picasso style, flat geometric facets, fragmented and abstract, innovative multiple perspectives, muted earthy palette",
  "futurism art {prompt} Umberto Boccioni style, dynamic speed and movement, fragmented technology themes, industrial energy, rhythmic repetition of forms",
  "dadaism art {prompt} Marcel Duchamp and Hannah Höch style, satirical photomontage, nonsensical absurdist collage, mixed media anti-art statement",
  "constructivism art {prompt} El Lissitzky style, minimalistic red and black, bold geometric forms, dynamic diagonal composition, Soviet propaganda aesthetic",
  "Bauhaus style {prompt} Walter Gropius and Kandinsky style, simple geometric shapes, clean functional lines, primary colors, unified design aesthetic",
  "de stijl art {prompt} Piet Mondrian style, neoplasticism, strict vertical and horizontal lines, primary red blue yellow, black grid planes",
  "art deco style {prompt} Tamara de Lempicka style, sleek geometric shapes, metallic gold and chrome, luxurious elegant symmetry, 1920s jazz age glamour",
  "surrealist art {prompt} Salvador Dali and René Magritte style, dreamlike irrational juxtaposition, melting forms, precise realistic painting of impossible scenes",
  "M.C. Escher style {prompt} impossible geometry, tessellated mathematical patterns, surreal perspective, intricate precise linework, high contrast monochrome woodcut aesthetic",
  "abstract expressionist painting {prompt} Jackson Pollock style, action painting, energetic paint drips, chaotic layered brushwork, highly expressive and emotional",
  "color field painting {prompt} Mark Rothko style, large luminous areas of flat solid color, soft blurred edges, profound emotional resonance, contemplative",
  "lyrical abstraction {prompt} Helen Frankenthaler style, fluid color wash stain painting, soft color harmonies, poetic mood, expressive non-representational",
  "pop art style {prompt} Andy Warhol and Roy Lichtenstein style, bright saturated colors, bold black outlines, comic book Ben-Day dots, mass culture iconography",
  "op art {prompt} Bridget Riley style, black and white optical illusion patterns, geometric waves, perceptual movement and vibration, precise",
  "minimalist fine art {prompt} Donald Judd style, extreme reduction, pure geometric form, industrial aesthetics, clean stark composition, flat surfaces",
  "geometric abstraction {prompt} hard-edge painting, precise flat planes of color, sharp boundaries, mathematical composition, non-representational",
  "psychedelic style {prompt} 1960s counterculture, Peter Max style, vibrant neon saturation, melting swirling patterns, abstract forms, surreal and trippy",
  "hyperrealistic art {prompt} Chuck Close style, extreme high-resolution photographic realism pushed to perfection, fine microscopic texture, incredibly lifelike"
];

// --- GROUP II: DESIGN & UTILITY ---

// 3. POP CULTURE, COMICS, ANIMATION & GAMES
const blockPopCulture = [
  // --- COMIC BOOKS & GRAPHIC NOVELS ---
  "vintage comic book art {prompt}. 1960s Silver Age Marvel style, Jack Kirby, halftone dots, crisp ink lines, dynamic graphic composition, primary colors, retro graphic illustration",
  "modern comic book art {prompt}. Jim Lee style, detailed crosshatching, sleek digital coloring, dynamic foreshortening, graphic novel illustration",
  "European comic art {prompt}. Bande Dessinée, Moebius style, Ligne Claire, clear thin ink lines, flat pastel colors, highly detailed surreal graphic aesthetic",
  "Philippe Druillet comic art {prompt}. Métal Hurlant style, intricate geometric linework, surreal sci-fi fantasy aesthetic, overwhelming scale, psychedelic colors, graphic novel",
  "Heavy Metal magazine style {prompt}. 1980s adult sci-fi fantasy comic, Simon Bisley style, gritty airbrush texture, hyper-detailed ink, dark dramatic graphic novel aesthetic",
  "underground comix {prompt}. Robert Crumb style, 1970s counterculture comic, dense anxious crosshatching, heavy ink linework, satirical distorted proportions, indie cartoon aesthetic",

  // --- CARICATURE, EDITORIAL & SATIRE ---
  "KAL political caricature {prompt}. Grotesque editorial cartoon exaggeration, knobbly noses and splayed teeth, heavy dewlaps and wattles, vast foreheads, aggressive cross-hatching, bold ink lines on newsprint texture, nuanced body language, intense emotional expressions, satirical political cartoon aesthetic",
  "David Levine pen-and-ink caricature {prompt}. Cross-hatched black-and-white portrait, fine parallel hatching for shadows, intense facial detail, spare elegant linework, 19th-century engraving influence, high-contrast monochrome, intellectual sharp political satire aesthetic",
  "Al Hirschfeld line caricature {prompt}. Elegant minimalist black-and-white contour drawing, continuous flowing calligraphic lines, pure linear expression with no shading, Broadway celebrity portrait style, whimsical negative-space form definition, timeless theatrical caricature aesthetic",
  "Sebastian Krüger oil caricature {prompt}. Hyper-realistic oil painting with extreme facial exaggeration, bold painterly brushwork, rock-star dramatic lighting, textured canvas with thick impasto, photorealistic skin tones pushed to grotesque proportions, dark moody atmosphere, painterly editorial illustration",
  "Philip Burke watercolor caricature {prompt}. Fluid elastic watercolor portrait, stretched facial features with emotional exaggeration, psychedelic color washes bleeding together, loose expressive brushstrokes, vibrant saturated Rolling Stone editorial palette, pop-culture music energy, painterly illustration aesthetic",
  "Tom Richmond comic caricature {prompt}. Clean confident ink lines with vibrant digital color, dynamic action-oriented poses, comic-style celebrity exaggeration, smooth cel-shaded color flats, polished MAD Magazine illustration aesthetic, bold outlines, expressive hands, contemporary humorous rendering",
  "Jason Seiler digital caricature {prompt}. Digital painterly portrait blending realism with subtle exaggeration, soft atmospheric lighting, refined edge control, sophisticated muted color palette, classical portrait composition, Time magazine editorial quality, polished contemporary illustration aesthetic",
  "Court Jones academic caricature {prompt}. Refined soft exaggeration with classical painting influence, subtle controlled distortion of features, smooth gradients and polished digital rendering, gentle humor with sophisticated technique, academic atelier approach, balanced proportions, refined illustrative portrait aesthetic",
  "Mad Magazine illustration {prompt}. Mort Drucker and Jack Davis style, humorous caricature aesthetic, dense crosshatching, satirical cartoon rendering, expressive exaggerated forms, ink and watercolor",
  "Spy vs. Spy comic art {prompt}. Antonio Prohías style, stark high contrast black and white, angular geometric design, sharp ink lines, retro comic strip graphic aesthetic",

  // --- NEWSPAPER & WEBCOMIC STRIPS ---
  "Dilbert comic style {prompt}. Minimalist American newspaper comic, simple clean uniform lines, minimal facial features with round eyeglasses, flat color fills with no shading, stark geometric minimalist environments, dry deadpan visual humor, sparse essential backgrounds only, ligne claire clarity, understated satirical workplace aesthetic",
  "XKCD stick-figure style {prompt}. Minimalist black-and-white pen-and-ink, simple circular heads with line bodies, expansive negative space, sparse precise linework, hand-drawn slight wobble, minimalist geometric annotations, clever understated humor, occasional detailed landscape contrast, webcomic aesthetic",
  "Doonesbury comic style {prompt}. Simple pen-and-ink comic strip, minimal line faces with distinctive large stylized noses, economy of line, gentle understated character design, multi-panel narrative layout framing, sparse clean backgrounds, literary sophisticated political satire, Jules Feiffer influenced simplicity, understated ink illustration aesthetic",

  // --- MANGA, WEBTOON & ANIMATION ---
  "manga artwork {prompt}. Japanese comic style, black and white screentone, dynamic speed lines, dramatic pen strokes, highly emotional shading, shonen aesthetic",
  "webtoon art style {prompt}. Korean manhwa style, smooth digital shading, glowing highlights, vibrant saturated colors, vertical scroll layout aesthetic",
  "anime key visual {prompt}. Studio Ghibli style, vibrant 2D animation, beautifully painted lush aesthetic, cel-shaded forms, nostalgic lighting",
  "1930s rubber hose animation {prompt}. vintage 1930s cartoon, Cuphead style, high contrast black and white, bouncy surreal proportions, retro inkblot animation",
  "Ralph Bakshi animation style {prompt}. 1970s adult rotoscope animation, gritty stylized realism, psychedelic undertones, cinematic high contrast cel-shading, mixed media aesthetic",
  "Family Guy animation style {prompt}. Seth MacFarlane cartoon aesthetic, flat 2D animation, thick thick uniform black outlines, bright flat colors, no shading, satirical adult sitcom style",

  // --- VIDEO GAME AESTHETICS ---
  "8-bit pixel art {prompt}. classic retro arcade, limited color palette, crisp blocky pixels, nostalgic 1980s game aesthetic",
  "16-bit SNES style {prompt}. vibrant pixel art, detailed retro pixel rendering, nostalgic 1990s JRPG aesthetic, charming color palette",
  "high fantasy RPG game art {prompt}. immersive first-person perspective rendering, atmospheric lighting, detailed UI-style inventory aesthetic, Skyrim engine style",
  "cyberpunk game style {prompt}. neon-drenched dystopian optical aesthetic, ray-traced reflections, high contrast nighttime lighting, Cyberpunk 2077 engine style",
  "cel-shaded adventure game {prompt}. painterly anime style, vibrant colors, soft atmospheric haze, sweeping open-world lighting, Breath of the Wild aesthetic",
  "JRPG character concept {prompt}. Tetsuya Nomura style, intricate fantasy detailing, stylized exaggerated proportions, dramatic lighting, Final Fantasy aesthetic",
  "block-building game {prompt}. voxel aesthetic, sharp pixel textures, blocky volumetric lighting, recognizable cuboid shapes, Minecraft rendering style",
  "3D platformer game {prompt}. vibrant primary colors, bouncy cartoony proportions, cheerful polished 3D render, Super Mario Odyssey aesthetic",
  "isometric strategy game {prompt}. Age of Empires aesthetic, overhead isometric view, precise miniature rendering, god-game visual perspective",
  "retro fighting game {prompt}. 2D arcade rendering, dynamic forced perspective, pixelated hit sparks, high energy lighting, Street Fighter II aesthetic",
  "pop-culture crime game {prompt}. satirical stylized illustration, vibrant colors, high-contrast action graphic shading, comic-book rendering, GTA visual aesthetic"
];

// 4. PRESENTATIONS, GRAPHICS & JOURNAL ASSETS
const blockPresentations = [
  // PURE POWERPOINT PRIMITIVES
  "powerpoint block flowchart {prompt} composed entirely of basic flat rectangular shapes, straight connecting lines with arrowheads, plain white background, solid color fills, zero shading, strict 2D presentation diagram",
  "corporate stock icon infographic {prompt} solid color flat stock icons, basic circular bounding shapes, flat vector illustration, minimalist presentation slide, strict white background, purely 2D graphic design",
  "Microsoft PowerPoint stock shape illustration {prompt} composed exclusively of basic geometric primitives, flat simple vectors, white background, corporate presentation slide template aesthetic",

  // POWERPOINT SMARTART & LAYOUT PRIMITIVES
  "powerpoint smartart list style {prompt} simple vertical or horizontal bulleted blocks, flat 2D vector shapes, minimalist academic presentation graphic, uniform size placeholders, white background",
  "powerpoint smartart process cycle {prompt} continuous circular arrows, simple 2D flow diagram, flat solid colors, no shading, clean instructional layout, white background",
  "powerpoint smartart relationship hierarchy {prompt} top-down triangular or branching hierarchical structure, simple connecting lines, flat geometric shapes, clear parent-child nodes, academic schematic style",
  "powerpoint smartart matrix layout {prompt} simple 2x2 grid with centered labels, minimalist vector borders, flat solid colors, strict presentation geometry, white background",

  // STRUCTURAL & LAYOUT DIAGRAMS
  "radial hub and spoke diagram {prompt} central circle connected to peripheral circles by straight line connectors, simple geometric primitives, flat vector graphics, presentation template style",
  "stacked box structural diagram {prompt} simple flat 2D rectangles stacked vertically, clean separation lines, solid primary colors, flat design, strict 2D profile, no isometric angles, basic presentation graphic",
  "linear process chevron flow {prompt} basic chevron block arrow shapes pointing horizontally, flat corporate vector graphic, solid color blocks, clean minimalist presentation layout",
  
  // ANALYTICAL & CONCEPTUAL DIAGRAMS
  "simple overlapping circle diagram {prompt} basic Venn diagram layout, translucent flat color circles, clean vector bounding lines, academic presentation graphic, white background",
  "four quadrant matrix diagram {prompt} simple 2x2 grid layout, solid flat vector icons inside each quadrant, basic straight separating lines, corporate presentation slide style, minimal geometry",
  "segmented triangular hierarchy diagram {prompt} simple triangular form divided into horizontal layer blocks, flat vector graphics, solid color fills, presentation template aesthetic",
  "simple node network diagram {prompt} small solid circles connected by thin straight lines, basic geometric layout, flat vector presentation graphic, abstract structural concept, white background",

  // ACADEMIC LECTURE & EXPLAINER STYLES
  "academic blackboard chalk drawing {prompt} dusty slate chalkboard background, crisp white and pastel chalk lines, academic chalkboard lecture aesthetic, hand-drawn diagrammatic sketch, strict 2D educational layout",
  "explainer whiteboard animation style {prompt} black dry erase marker line art, clean white background, minimalist hand-drawn diagram, educational explainer video aesthetic, strict 2D vector sketch",
  
  // JOURNAL PUBLICATION & PRINT FIGURES
  "technical patent drawing {prompt} strict monochrome line drawing, clean black ink line art, white background, structural contours, minimalist academic journal figure, precise schematic drafting",
  "scientific textbook illustration {prompt} black and white stippling art, fine micron pen crosshatching, detailed academic figure, monochrome engraving style, crisp white background, clear visual hierarchy",
  "engineering CAD wireframe schematic {prompt} clean structural lines, purely wireframe blueprint, no solid rendered faces, technical engineering drawing, stark white background, high contrast precision aesthetic",
  "academic journal print figure {prompt} strict grayscale illustration, high contrast halftone print aesthetic, clear visual hierarchy, optimized for black and white publication, minimalist vector graphic",

  // ADVANCED MATHEMATICS & COMPUTATIONAL PLOTS
  "Wolfram Mathematica 3D plot aesthetic {prompt} precise mathematical surface rendering, gradient color mesh, bounding coordinate box with tick marks, clean academic vector graphic, scientific computing aesthetic, white background",
  "differential geometry topology aesthetic {prompt} abstract topological projection, overlapping smooth coverings, curved 2D planar elements, mathematical line drawing, textbook schematic, strict white background",
  "Python matplotlib aesthetic {prompt} crisp coordinate axes, flat data visualization style, distinct high-contrast plotted lines, precise data nodes, minimalist academic journal figure, scientific computing style, white background",
  "complex multi-dimensional surface geometry {prompt} transparent intersecting 3D surfaces, continuous manifold mapping, clean wireframe mesh, pure structural math visualization, academic textbook graphic, strict white background"
];

// 5. COMMERCIAL DESIGN, EVENTS & INK
const blockCommercialDesign = [
  // ADVERTISING & CORPORATE BRANDING
  "commercial advertising campaign {prompt}. professional, modern, sleek, high-end commercial aesthetic, studio lighting, eye-catching, highly detailed",
  "automotive commercial rendering {prompt}. sleek dynamic studio lighting, reflective showroom aesthetic, high-contrast dramatic highlights, professional commercial finish",
  "corporate branding style {prompt}. professional, clean, modern, sleek, minimalist, high-end business aesthetic, highly detailed",
  "fashion editorial style {prompt}. high fashion aesthetic, trendy, sophisticated lighting, editorial styling, professional studio rendering",
  "premium product photography {prompt}. high-resolution commercial studio lighting, rich color saturation, glossy premium finish, enticing aesthetic",
  "luxury brand commercial {prompt}. elegant, sophisticated, high-end, luxurious, dramatic spotlighting, premium material reflections, highly detailed",
  "architectural commercial lighting {prompt}. professional, inviting, well-lit, high-resolution, bright ambient daylight, premium commercial space aesthetic",
  "retail packaging design {prompt}. vibrant graphic design, clean layout, bold commercial branding, enticing product presentation, highly detailed",
  "logo design {prompt}. minimalist corporate logo, vector graphics, clean dynamic shapes, white background, professional branding",

  // POSTERS & PUBLICATIONS
  "silk screen poster {prompt}. screen printing, bold flat spot colors, Shepard Fairey style, high contrast threshold, thick outlines, graphic design",
  "vintage travel poster {prompt}. WPA travel poster aesthetic, bold flat colors, clean vector typography, nostalgic tourism illustration, retro graphic design",
  "magazine cover layout {prompt}. editorial publication aesthetic, bold masthead typography, barcode and text overlays, glossy print style, professional graphic design",

  // EVENT GREETINGS & STATIONERY
  "vintage greeting card art {prompt}. 1950s Golden Age illustration, soft pastel colors, nostalgic heartwarming aesthetic, painted vignette, Norman Rockwell influence, classic Americana holiday style",
  "mid-century modern graphic {prompt}. 1960s flat vector aesthetic, Mary Blair style, geometric shapes, retro color palette, stylized playful proportions, minimalist event poster design",
  "intricate papercraft pop-up {prompt}. 3D layered paper art, crisp cut edges, soft studio lighting, delicate drop shadows, origami and kirigami influence, whimsical storybook aesthetic",
  "classic letterpress print {prompt}. tactile indented paper texture, limited color ink press, elegant typography layout styling, vintage engraved illustration, artisanal stationery aesthetic",
  "chalkboard typography art {prompt}. hand-drawn chalk lettering aesthetic, dusty slate background, floral chalk flourishes, rustic cafe menu style, casual celebratory vibe",
  "modern minimalist vector {prompt}. clean corporate illustration, lots of negative space, soft gradient shading, bright optimistic color palette, contemporary tech startup aesthetic",
  
// The Classic Pinup
  "classic 1950s pinup illustration {prompt} Gil Elvgren and Art Frahm style, vintage commercial art, vibrant retro colors, painted gouache illustration, stylized mid-century advertising, flawless classic aesthetic",

  // The Rockwell Americana
  "classic Americana illustration {prompt} Norman Rockwell style, Saturday Evening Post cover, detailed narrative painting, slice-of-life realism, expressive realistic faces, oil painting aesthetic, 1940s nostalgic America",

// Military Aviation Artifact
  "macro photography of riveted bare aluminum aircraft fuselage, featuring authentic WW2 bomber nose art of {prompt}, painted in 1940s Alberto Vargas pinup illustration style, flat enamel paint, weathered Memphis Belle aesthetic, flaking military aviation paint, historical flightline artifact",

  // TATTOO & INK ARTS
  "American traditional tattoo {prompt}. Sailor Jerry style, bold thick black outlines, limited color palette of red green and yellow, flat 2D flash art aesthetic, vintage tattoo illustration",
  "neo-traditional tattoo {prompt}. lush detailed illustration, varying line weights, rich jewel-tone colors, Art Nouveau influence, highly decorative flash art",
  "blackwork tattoo art {prompt}. strict monochrome, heavy black ink, intricate dot-work shading, stippling texture, occult or geometric motifs, stark high contrast",
  "fine line minimalist tattoo {prompt}. single needle aesthetic, delicate whisper-thin black lines, minimalist elegant design, lots of negative space, crisp clean rendering",
  "irezumi Japanese tattoo {prompt}. traditional yakuza body suit aesthetic, flowing wind bars and water motifs, vibrant contrasting colors, dense highly detailed composition"
];

// 6. DIGITAL WALLPAPER, 3D RENDERS & CONCEPT ART (The Specialty Block)
const blockWallpaper = [
  // HIGH-DETAIL WALLPAPER AESTHETICS
  "high-tech abstract wallpaper {prompt}. sleek metallic structural elements, glowing copper cybernetic pathways, dark minimalist aesthetic, cinematic lighting, 8k resolution, ultra-detailed",
  "elegant Norse-inspired digital art {prompt}. intricate ancient knotwork motifs, muted earth tones with radiant golden highlights, cinematic depth, symmetrical composition, 8k resolution, highly detailed",
  "steampunk-inspired digital design {prompt}. intricate mechanical detailing, metallic brushed copper and brass textures, sophisticated retro-industrial aesthetic, cinematic depth, highly detailed, 8k resolution",
  "cinematic science fiction aesthetic {prompt}. sleek futuristic surfaces, contrasting color gradients, cool-toned industrial lighting, polished carbon-fiber textures, ultra-realistic, high-tech environmental lighting, highly detailed",
  "majestic mythological fantasy aesthetic {prompt}. ornate symmetrical composition, intricate filigree decorative elements, vibrant luminous accents against a dark, sophisticated backdrop, highly detailed",
  "sophisticated abstract aesthetic {prompt}. precise geometric structuring, ethereal dark-themed fractal patterns, flowing nebular gradients, elegant fusion of technical precision and artistic wonder",
  "antique academic aesthetic {prompt}. embossed brass relief texture, intricate craftsmanship, historical gravitas, seamless integration of precise structural motifs, metallic sheen",
  "industrial science-fiction design {prompt}. precision-engineered metallic textures, glowing blue data pathways, stark monochromatic lighting, high-tech depth, mechanical surface complexity",
  "contemporary graphic design {prompt}. deeply embossed metallic relief textures, clean modern layout, warm atmospheric gradient, balancing classical motifs with sleek commercial aesthetics",
  "surreal conceptual art {prompt}. cosmic lighting aesthetic, elegant ornate motifs, dual-tone golden and blue ethereal swirls, seamless mystical integration, deep contrasting background",
  "Victorian steampunk schematic {prompt}. intricate brass and copper mechanical details, sepia-toned drafting paper, precise technical linework, clockwork gear motifs, Jules Verne retro-futurism aesthetic",
  "deep space cosmic rendering {prompt}. Hubble telescope astrophotography style, vibrant glowing nebulae, highly detailed starry backdrop, sweeping galactic lighting, awe-inspiring celestial aesthetic",
  "mythological classical fresco {prompt}. Renaissance mural painting, cracked aged plaster texture, dramatic chiaroscuro lighting, epic scale, classical antiquity aesthetic, grand mythological composition",
  "futuristic technical blueprint {prompt}. glowing cyan wireframe on dark grid background, highly detailed vector schematics, holographic data readouts, hard sci-fi UI aesthetic",

  // MINIMALIST & DEVIANTART COMMUNITY ADDITIONS
  "minimalist vector landscape {prompt}. clean geometric flat shapes, sweeping atmospheric sky gradient, vast negative space, sharp edge control, stark modern graphic design aesthetic, elegant simplicity",
  "dark neo-noir minimalist graphic {prompt}. high-contrast ink-wash style, deep shadow vignettes, stark single-source dramatic lighting, moody cinematic silhouette composition, clean graphic lines",
  "DeviantArt digital speedpaint {prompt}. atmospheric concept art style, loose expressive digital brushstrokes, dramatic focal rim lighting, epic environmental scale, rich textured lighting layer, high-impact fantasy digital illustration",
  "AMOLED neon line-art {prompt}. absolute pure black backdrop, ultra-thin glowing luminescent linework, minimalist high-contrast geometry, sleek vector tech aesthetic, crisp geometric precision",
  "abstract low-poly geometric art {prompt}. faceted crystalline surfaces, sharp angular polygon structures, subtle ambient occlusion shadows, elegant jewel-toned color gradients, minimalist technical render",

  // 3D RENDER ENGINES & CGI
  "Octane Render {prompt}. physically based rendering, cinematic lighting, glossy subsurface scattering, rich global illumination, highly detailed 3D render",
  "Unreal Engine 5 style {prompt}. Lumen lighting aesthetic, real-time raytracing, hyper-realistic video game engine render, crisp ambient occlusion",
  "ZBrush sculpt {prompt}. digital clay aesthetic, unpainted grey resin material, intricate high-poly digital sculpting, smooth ambient lighting, turntable presentation",
  "low poly 3D render {prompt}. faceted geometric shapes, flat shaded polygons, Blender isometric render, soft studio lighting, minimalist 3D graphic",
  "V-Ray architectural render {prompt}. pristine photorealistic CGI, perfectly balanced interior lighting, hyper-realistic material reflections, archviz aesthetic",
  "macro tilt-shift miniature 3D {prompt}. Octane render miniature diorama, shallow depth of field, tilt-shift lens blur, glossy toy-like textures, bright studio lighting",

  // CHARACTER DESIGN & CONCEPT SHEETS
  "character turnaround sheet {prompt}. multiple angles, front side and back view, neutral pose, white background, detailed concept art layout, professional character design",
  "character expression sheet {prompt}. multiple facial expressions of the same character, varied emotions, concept art sketch style, white background, grid layout",
  "silhouette concept exploration {prompt}. stark black silhouettes on white background, varied shape language, character design thumbnails, graphic concept art",
  "dynamic action pose sheet {prompt}. same character in multiple dynamic fluid poses, action lines, concept art sketch, rough energetic line art, white background",
  "orthographic 3D reference sheet {prompt}. strict front and side profile views, t-pose, anatomical symmetry, perfectly aligned grid background, 3D modeling reference template"
];

// --- GROUP III: WORLD BUILDING ---

// 7. GENRE & STORYTELLING (Sci-Fi, Fantasy, Horror)
const blockGenre = [
  "high fantasy painting {prompt} Frank Frazetta spirit, dramatic intense lighting, dynamic energy, epic scale, oil on canvas",
  "classic fantasy cover art {prompt} Michael Whelan inspired, luminous color gradients, surreal otherworldly aesthetic, 1980s paperback style",
  "heroic fantasy illustration {prompt} Boris Vallejo style, hyper-stylized heroic proportions, airbrush painting, dynamic adventurous energy, glossy lighting",
  "Tolkien illustration style {prompt} Alan Lee and John Howe inspired, misty atmospheric depth, muted earthy palette, fine pencil and watercolor detail",
  "Brian Froud style faerie illustration {prompt} whimsical yet eerie folklore aesthetic, mossy organic textures, intricate detailing, watercolor and pencil",
  "1980s TSR D&D art style {prompt} Larry Elmore inspired, classic tabletop RPG illustration aesthetic, saturated colors, bold traditional shading",
  "dark fantasy art {prompt} dark, moody, obsidian blacks, eerie atmosphere, deep shadows, macabre, haunting concept art",
  "gothic horror style {prompt} Castlevania aesthetic, Ayami Kojima inspired, dark mysterious fog, ornate gothic detailing, crimson accents, dramatic",
  "lovecraftian horror {prompt} eldritch cosmic horror aesthetic, non-Euclidean geometry, unknown terrifying scale, mysterious, surreal, highly detailed",
  "macabre illustration {prompt} Stephen Gammell style, terrifying ink wash, spindly dripping lines, scary stories to tell in the dark, nightmare fuel",
  "mythological art {prompt} ancient legendary aesthetic, epic narrative scope, classical painting style, dramatic heavenly lighting",
  "fairy tale illustration {prompt} magical, fantastical, enchanting storybook atmosphere, glowing light, highly detailed whimsical styling",
  "surreal dreamscape {prompt} ethereal, floaty, mysterious, bending reality, dream logic composition, highly detailed digital painting",
  "cyberpunk cityscape aesthetic {prompt} neon lighting, dark wet reflective surfaces, towering vertical depth, futuristic neon palette, high contrast, highly detailed",
  "cyberpunk character aesthetic {prompt} high-tech low-life style, chrome cybernetic textures, neon rim lighting, dystopian styling, highly detailed",
  "steampunk style {prompt} Victorian sci-fi aesthetic, brass and copper textures, clockwork mechanical detailing, sepia tone, antique finish, intricate craftsmanship",
  "dieselpunk style {prompt} 1930s industrial retro-futurism aesthetic, gritty mechanical textures, riveted steel, soot and smoke atmosphere",
  "atompunk style {prompt} 1950s atomic age sci-fi aesthetic, Fallout style, gleaming chrome surfaces, retro-futuristic styling, nuclear optimism",
  "retro cyberpunk {prompt} 80s inspired synthwave, neon pink and purple, glowing neon vectors, vibrant retro-futurism, CRT monitor glow",
  "vaporwave style {prompt} 1990s aesthetic, pastel pink and cyan, nostalgic early 3D render aesthetic, glitch art styling",
  "hard sci-fi concept art {prompt} Syd Mead style, near-future industrial design, functional engineering aesthetic, realistic technological styling, sleek geometric lines",
  "space opera illustration {prompt} John Berkey style, sweeping galactic scale, impressionistic sci-fi cover art, dynamic cinematic lighting",
  "futuristic biomechanical {prompt} H.R. Giger inspired, organic machinery textures, dark surreal sci-fi, fused bone and steel aesthetic, monochromatic",
  "Neo-futurism architecture aesthetic {prompt} sleek parametric curves, massive utopian sci-fi scale, gleaming white materials, bright daylight, highly detailed",
  "high-detail space matte painting {prompt} high-detail orbital cinematic aesthetic, atmospheric glow, vast scale, cinematic lighting, space documentary style",
  "deep space nebula illustration {prompt} Hubble-like photography aesthetic, vibrant ionized gas cloud textures, high dynamic range cosmos styling",
  "retro NASA space tourism poster style {prompt} WPA travel poster aesthetic, bold flat colors, clean vector layout, retro-futurist optimism",
  "Soviet space-race propaganda poster style {prompt} heroic constructivist tone, bold diagonal compositions, strong red accents, vintage propaganda aesthetic",
  "tactical aerospace schematic {prompt} military radar overlay aesthetic, HUD interface elements, ballistic trajectory lines, wireframe intercept graphics, dark mode tech style",
  "orbital mechanics diagram {prompt} highly detailed astrodynamics schematic aesthetic, concentric orbital lines, transfer ellipses, delta-v vector graphics, clean blueprint layout",
  "orbital space debris visualization {prompt} Kessler syndrome simulation aesthetic, 3D data visualization style, glowing orbital particle field, dark void background",
  "sai-neonpunk {prompt} cyberpunk, vaporwave, neon, vibes, vibrant, stunningly beautiful, crisp, detailed, sleek, ultramodern, magenta highlights, dark purple shadows, high contrast, cinematic, ultra detailed, intricate, professional"
];

// 8. HISTORY & ERAS
const blockHistory = [
  "ancient Egyptian art {prompt} pharaonic aesthetic, ancient wall painting, hieroglyphic graphic style, papyrus texture, rich ochre and lapis lazuli pigments, ancient artifact finish",
  "ancient Mesoamerican art {prompt} pre-Columbian stone carving aesthetic, intricate geometric reliefs, weathered stone texture, historical archaeological atmosphere",
  "ancient Greek art {prompt} red-figure pottery graphic style, classical Hellenic aesthetic, Mediterranean lighting, smooth marble texture, idealized classical proportions",
  "Roman Empire era {prompt} classical Roman aesthetic, fresco plaster texture, imperial grandeur, warm terracotta and gold palette, mosaic tile patterns",
  "Dark Ages aesthetic {prompt} illuminated manuscript style, early medieval aesthetic, rough hewn textures, torchlit atmospheric lighting, muted earth tones, historical illustration",
  "High Medieval {prompt} 13th century heraldic aesthetic, rich jewel tones, gothic structural motifs, historical fine art, medieval manuscript illumination",
  "Italian Renaissance {prompt} 15th century oil painting, chiaroscuro lighting, classical proportions, sfumato technique, da Vinci style, historical fine art masterpiece",
  "Tudor Elizabethan era {prompt} 16th century English court aesthetic, candlelit chiaroscuro, rich crimson and gold velvet textures, masterpiece oil portraiture lighting",
  "Edo period Japan {prompt} traditional Japanese woodblock print aesthetic, Edo period style, flat bold colors, distinct flowing outlines, crisp ink and wash",
  "Baroque era {prompt} 17th century oil painting, dramatic directional lighting, deep enveloping shadows, ornate classical detail, opulent aesthetic, Rembrandt lighting style",
  "Georgian Regency era {prompt} Neoclassical fine art aesthetic, muted pastel palette, refined elegance, classical composition, soft candlelit oil rendering",
  "Victorian London {prompt} 1880s industrial revolution aesthetic, thick atmospheric smog, gas-lit dramatic atmosphere, brooding lighting, rich detailed oil canvas",
  "Antebellum South {prompt} 1850s southern gothic atmospheric lighting, luminous master lighting, vintage fine art oil painting, dramatic classical shadows",
  "American Civil War era {prompt} 1860s historical military realism aesthetic, James Walker style, smoke-filled atmospheric lighting, sweeping epic canvas rendering",
  "American Wild West {prompt} 1880s frontier oil realism, expressive rugged brushwork, dusty atmospheric lighting, dramatic western sunset palette, pioneer aesthetic",
  "Belle Époque {prompt} 1890s Parisian poster art aesthetic, Toulouse-Lautrec style, rich jewel tones, ornate fin-de-siecle detailing, vintage lithograph",
  "WWI Western Front aesthetic {prompt} Richard Jack style, monumental historical art aesthetic, dynamic chaotic energy, heavy atmospheric smoke, dramatic heroism oil-on-canvas",
  "WWI Haunting Aftermath {prompt} Frederick Varley and A.Y. Jackson style, expressionistic scarred textures, haunting somber lighting, profound devastated atmosphere, heavy oil brushwork",
  "WWI Home Front Industry {prompt} Mabel May and Arthur Lismer style, 1910s industrial realism, vibrant labor aesthetic, dynamic structural composition, energetic oil painting",
  "WWII Action Realism {prompt} Orville Fisher style, battlefield sketch translation, dynamic chaotic action, gritty smoke-filled atmospheric realism, historical action painting",
  "WWII European Theater Realism {prompt} Alex Colville style, hyper-still tense atmosphere, grueling realism, somber historic magic realism, precise structural rendering",
  "WWII Home Front Social {prompt} Molly Lamb Bobak style, lively expressive brushwork, chaotic everyday social atmosphere, energetic oil sketch",
  "WWII Campaign & Command {prompt} Charles Comfort style, rugged environmental textures, bold structured composition, intense focused atmosphere, historical oil rendering",
  "WWII Naval Theater {prompt} C. Anthony Law style, dramatic official war art, dynamic splashing fluid textures, powerful energetic movement, vibrant marine realism",
  "WWII Devastated Psyche {prompt} Jack Shadbolt style, powerful graphic abstraction, shattered structural textures, somber brooding surreal tones, intense emotional weight",
  "1950s Americana {prompt} mid-century modern hyperrealistic oil painting, optimistic post-war advertising finish, pristine pastel color palette, meticulous high-gloss detailing, luminous canvas texture",
  "1960s Mid-Century Modern {prompt} hyperrealistic gouache illustration, sleek space-age geometric layout, early tech analog aesthetic, high-end Madison Avenue editorial art, clean crisp lines",
  "1970s Brutalist & Retro Realism {prompt} sharp-focus magic realism painting, imposing brutalist concrete textures, warm earthy color palette, vintage analog fidelity aesthetic, hyper-detailed lighting",
  "1980s Corporate High-Tech {prompt} slick airbrush hyperrealism, pristine postmodern corporate aesthetic, high-contrast neon-rimmed metallic highlights, vintage high-tech finish, ultra-detailed",
  "1990s Industrial Minimalism {prompt} contemporary fine art oil realism, minimalist industrial aesthetic, tactical grunge textures, cool-toned ambient lighting, hyper-sharp edge precision",
  "early 2000s Y2K Futurism {prompt} high-fidelity digital realism painting, organic parametric forms, gleaming chrome and translucent plastic textures, vibrant high-gloss finish, pristine macro detail, Y2K aesthetic"
];

// 9. CULTURE & HERITAGE
const blockCulture = [
  "Aboriginal dot painting {prompt} Papunya Tula style, indigenous Australian art, intricate rhythmic dot patterns, earth ochre palette, flat aerial graphic perspective",
  "Haida art {prompt} Pacific Northwest indigenous formline design, bold U-forms and ovoids, traditional wood carving aesthetic, striking red, black, and cedar colors",
  "Bill Reid style sculpture {prompt} Spirit of Haida Gwaii aesthetic, monumental Pacific Northwest bronze carving, dynamic interlocking forms, polished dark green-black patina, highly detailed indigenous sculpture",
  "Haida printmaking {prompt} Bill Reid inspired formline graphic art, bold black and red traditional motifs, elegant intertwining forms, clean vector-like precision, indigenous screen print aesthetic",
  "Maori art {prompt} whakairo wood carving style, intricate koru fern patterns, paua shell inlay textures, traditional Polynesian tribal aesthetic, highly detailed",
  "Plains Indian ledger art {prompt} 19th-century indigenous aesthetic, colored pencil and ink on vintage lined ledger paper, flat profile graphic perspective, traditional ledger style",
  "Inuit soapstone sculpture {prompt} traditional arctic carving aesthetic, smooth polished stone texture, minimalist stylized forms, monochromatic stone gray and green finish",
  "Inuit painting and printmaking {prompt} traditional Cape Dorset print aesthetic, bold stylized forms, flat colors, crisp stencil graphic style, indigenous printmaking textures",
  "Hawaiian indigenous art {prompt} traditional Kapa cloth texture, Polynesian tribal tattoo motifs, geometric block print aesthetic, earthy brown and black dyes",
  "Mexican muralism {prompt} Diego Rivera style, monumental fresco scale, bold earthy colors, dynamic heavy brushwork, monumental muralism aesthetic",
  "Andean textile art {prompt} traditional Peruvian Aguayo weaving, bright neon geometric patterns, thick woven alpaca wool texture, vibrant textile aesthetic",
  "Ndebele tribal art {prompt} Southern African geometric painting style, bold striking patterns, thick black outlines, vibrant primary colors, flat symmetrical graphic design",
  "North African Berber art {prompt} traditional Amazigh textile patterns, geometric tribal weaving, earthy terracotta and indigo tones, desert nomadic textile aesthetic",
  "Islamic geometric art {prompt} traditional Arabic arabesque, complex repeating star polygons, glazed zellige tilework texture, ornate structural detailing, lapis lazuli and gold",
  "traditional Chinese painting {prompt} Gongbi style, meticulous brushwork, ink and wash on silk texture, serene atmospheric depth, elegant calligraphic strokes, highly detailed",
  "East Indian mandala art {prompt} intricate geometric symmetry, spiritual yantra patterns, vibrant Rangoli colored powder texture, highly detailed decorative aesthetic",
  "Mughal miniature painting {prompt} South Asian courtly art aesthetic, highly detailed floral border illumination, flat perspective, opaque watercolor texture, rich jewel tones and gold",
  "Persian miniature painting {prompt} Safavid dynasty style, intricate geometric borders, flat perspective, vivid jewel tones, gold leaf detail, highly detailed illuminated manuscript aesthetic",
  "Filipino Jeepney art {prompt} Manila street art aesthetic, maximalist vibrant colors, dense graphic decals, maximalist chrome detailing, highly decorated aesthetic",
  "Filipino Yakan weaving {prompt} traditional indigenous textile pattern, intricate geometric diamond motifs, vibrant high-contrast colors, tight tactile fabric weave",
  "Vietnamese lacquer painting {prompt} Son Mai aesthetic, polished resin texture, inlaid eggshell detailing, gold leaf highlights, deep rich reds and blacks, serene atmospheric finish",
  "Russian Khokhloma folk art {prompt} traditional wood painting aesthetic, curved floral and berry pattern motifs, vibrant red and gold on black background, ornate decorative finish",
  "Scottish Glasgow School {prompt} Charles Rennie Mackintosh aesthetic, Scottish Art Nouveau, elongated geometric forms, stylized linear roses, elegant stained glass design textures",
  "Irish Celtic folklore aesthetic {prompt} emerald green atmospheric tones, rustic weathered stone texture, traditional Gaelic mist-shrouded atmosphere, ancient historical aesthetic",
  "Basque cultural art {prompt} traditional Lauburu cross motifs, vibrant red and green colors, rustic Pyrenees folklore aesthetic, strong bold traditional illustration",
  "French Toile de Jouy {prompt} traditional 18th-century French textile pattern, pastoral monochromatic engraved motifs, flourishing botanical accents, blue on white background, elegant classical texture",
  "German Bavarian folk art {prompt} traditional Bauernmalerei painting, rustic wood texture, vibrant floral motifs on dark backgrounds, rustic alpine folk aesthetic",
  "Polish Wycinanki art {prompt} traditional paper cutting aesthetic, vibrant layered colors, symmetrical intricate motifs, precise decorative papercraft texture",
  "Swedish Kurbits folk art {prompt} traditional Dala woodcraft aesthetic, ornate floral gourd motifs, vibrant red and blue on rustic wood, Scandinavian traditional decorative design",
  "Danish minimalist design {prompt} Scandinavian modern aesthetic, clean functional lines, light birch wood textures, muted pastel palette, elegant minimalist atmosphere",
  "Celtic knotwork art {prompt} Book of Kells illuminated manuscript style, intricate interlacing knots, ancient runic textures, mossy green and gold tones, insular art aesthetic",
  "Viking Norse aesthetic {prompt} Urnes stave wood carving style, intertwining animal motifs, weathered oak woodgrain, rugged etched textures, dark atmospheric finish",
  "Neo-Byzantine style {prompt} religious Orthodox icon painting aesthetic, shimmering gold leaf background, tesserae mosaic texture, flat stylized rendering, rich crimson and ultramarine",
  "Medieval illuminated manuscript {prompt} 14th-century gothic aesthetic, ornate drop caps, gold leaf illumination, painted on vellum texture, rich tempera colors, intricate marginalia style",
  "Harlem Renaissance art style {prompt} Aaron Douglas inspired, flat geometric silhouettes, dynamic Art Deco influence, 1920s jazz age aesthetic, monochromatic color gradients",
  "Victorian decorative arts {prompt} William Morris wallpaper aesthetic, dense intricate botanical motifs, Arts and Crafts movement styling, rich deep greens and burgundies",
  "Edwardian elegance {prompt} early 1900s aesthetic, refined pastel color palette, delicate lace textures, ornate filigree, aristocratic historical atmosphere"
];

// 10. ENVIRONMENT & ATMOSPHERE
const blockEnvironment = [
  "epic cinematic atmospheric scale {prompt} sweeping panoramic framing, atmospheric perspective, epic sense of scale, dramatic, matte painting finish, 8k resolution",
  "Group of Seven aesthetic {prompt} Canadian post-impressionism, bold expressive brushstrokes, rugged textured oil finish, dramatic wilderness lighting, rich vibrant color palette",
  "Romantic era atmospheric painting {prompt} Hudson River School style, dramatic skies, glowing light breaking through atmosphere, sublime atmospheric depth",
  "plein-air painting style {prompt} loose expressive brushstrokes, natural daylight, impressionistic textures, outdoor ambient lighting, capturing fleeting light",
  "high-detail cinematic matte painting {prompt} film production concept art finish, layered atmospheric depth, volumetric light, sweeping cinematic composition",
  "minimalist atmospheric aesthetic {prompt} large flat color fields, simple silhouettes, tranquil mood, serene, vast negative space",
  "golden hour lighting {prompt} warm sun flares, long shadows, cinematic magic hour, rich amber tones, heavily backlit",
  "bioluminescent lighting {prompt} glowing neon illumination, dark environment, ethereal light emitting surfaces, high contrast glowing highlights",
  "volumetric fog {prompt} god rays piercing through dense mist, Tyndall effect, ethereal atmosphere, dramatic light shafts",
  "dramatic celestial silhouette {prompt} heavily backlit, stark contrast, cinematic nightscape lighting, epic scale background illumination",
  "dark moody atmosphere {prompt} low key lighting, dramatic mysterious shadows, brooding cinematic tension, underexposed",
  "light cheery atmosphere {prompt} high key lighting, bright natural sunlight, airy, pastel tones, joyful carefree mood",
  "candlelight illumination {prompt} warm flickering orange glow, deep surrounding shadows, intimate atmosphere, painterly chiaroscuro lighting",
  "heavy rainstorm atmosphere {prompt} torrential downpour aesthetic, wet reflective surfaces, dark overcast sky lighting, moody cinematic contrast",
  "severe thunderstorm lighting {prompt} dramatic flash illumination, ominous dark skies, extreme weather atmosphere, high-contrast stormy lighting",
  "winter blizzard atmosphere {prompt} whiteout conditions, frost and ice textures, freezing cold atmospheric tint",
  "underwater optical aesthetic {prompt} deep aquatic lighting, caustic light rays refracting, suspended particles, ethereal deep blue atmospheric tones",
  "architectural ArchViz rendering {prompt} clean modernist lines, professional CGI studio lighting, neutral palette, dramatic natural daylight, photorealistic finish",
  "brutalist concrete aesthetic {prompt} raw exposed concrete textures, monumental scale, harsh geometric structural shadows, imposing dystopian atmosphere",
  "interior design editorial lighting {prompt} warm ambient lighting, Architectural Digest styling aesthetic, soft diffused natural light, highly detailed surfaces",
  "liminal space aesthetic {prompt} unsettling empty atmosphere, backrooms lighting aesthetic, fluorescent hum, eerie familiarity, transitional spatial mood",
  "topographic map aesthetic {prompt} contour lines, simplified elevation shading, cartographic illustration style, precise mapping vectors",
  "satellite imagery style {prompt} high-altitude orbital perspective, low earth orbit photography aesthetic, realistic atmospheric haze, extreme top-down rendering"
];

// 11. CRAFT & TEXTURE
const blockCraft = [
  "stained glass art {prompt} Tiffany style glass, glowing colorful light patterns, dark lead cames, luminous, ornate",
  "cloisonne enamel {prompt} intricate wirework borders, vibrant glossy glass enamel finish, polished metal, highly detailed decorative craft",
  "kintsugi aesthetic {prompt} glowing gold lacquer seams, cracked porcelain texture, wabi-sabi tactile finish",
  "mosaic art {prompt} small colored glass tiles, Byzantine style aesthetic, geometric patterns, vibrant, grouted texture",
  "Damascus steel texture {prompt} pattern-welded metal, swirling water-like steel ripples, high-contrast folded metal texture, forged metallic aesthetic, metallic sheen",
  "wrought iron metalwork {prompt} hand-hammered black metal, ornate metalcraft, gothic scrollwork, textured charcoal iron, dark industrial rustic",
  "repousse metal art {prompt} hammered sheet metal relief, chased detailing, 3D raised metallic texture, ancient gold and bronze artifact finish, polished sheen",
  "gold filigree {prompt} intricate delicate wirework, lace-like metallic threads, ornate goldsmithing aesthetic, shimmering luxury, highly detailed",
  "patinated copper {prompt} verdigris texture, oxidized bronze, weathered turquoise and green crust over metallic copper, antique aged metal finish",
  "liquid metal chrome {prompt} fluid mercury surface, high-gloss mirror reflections, futuristic melted chrome, seamless metallic pooling, surreal 3D render",
  "bismuth crystal texture {prompt} iridescent metallic hopper crystals, stepped geometric staircase formations, rainbow oxidation, mesmerizing colorful sheen",
  "origami style {prompt} paper art, pleated paper, folded, crisp geometric folds, pleats, cut and fold texture, centered composition",
  "sai-craft clay play-doh style {prompt} sculptural clay art, centered composition, Claymation texture, highly textured tactile finish",
  "sai-texture {prompt} top down close-up texture, tactile surface detail, macro photography of material, high resolution",
  "quilling paper art {prompt} tightly rolled paper strips, intricate filigree coils, 3D tactile paper texture, vibrant decorative craft",
  "3D layered papercut art {prompt} layered cardstock, dimensional depth, silhouette, shadow, handmade tactile aesthetic, back-lit high contrast",
  "cross-stitch embroidery {prompt} textile art, counted thread, pixel-like grid, fabric Aida texture, handmade thread texture",
  "amigurumi crochet {prompt} knit stitches, soft plush yarn texture, cute handmade tactile aesthetic",
  "patchwork textile art {prompt} sewn fabric squares, stitched seams, patterned cotton textiles, cozy handmade craft texture",
  "clay diorama aesthetic {prompt} miniature stop-motion aesthetic, handcrafted, plasticine textures, fingerprints visible, tactile 3D rendering",
  "mixed media collage {prompt} torn magazine pages, layered textures, paper ephemera, artistic scrapbooking aesthetic, Dadaist influence",
  "wood intarsia {prompt} intricate wood inlay, contrasting wood grains, polished timber texture, handcrafted marquetry finish",
  "zentangle {prompt} intricate abstract doodle, monochrome, repeating patterns, meditative ink drawing texture, highly detailed",
  "dark academia aesthetic {prompt} vintage academic atmosphere, warm mahogany tones, scholarly, moody lighting, highly detailed classical aesthetic",
  "cottagecore aesthetic {prompt} cozy vintage rustic textures, soft natural light, wholesome pastoral atmosphere, idyllic lighting"
];

// ==========================================
// 2. NEGATIVE PROMPT TIERS
// ==========================================

// LIGHT (Universal) - Structural and watermark limits. (Safe for all styles)
const negativeLight = "watermark, signature, text, font, typography, letters, words, logo, ugly, deformed, disfigured, bad anatomy, cross-eyed, extra fingers, bad hands, extra limbs, missing limbs, out of frame, duplicate";

// STANDARD - The "Sloppy" Tier. 
// Enhances edge control without killing medium-specific textures.
const negativeStandard = negativeLight + ", blurry, sloppy, messy, amateurish, unattractive, low quality, jpeg artifacts, overexposed, washed out, cropped, tiling, plastic, uncanny valley, cloned face, distorted";

// PHOTOGRAPHY - The Realism Tier.
// Used EXCLUSIVELY for the Photography block to ban painted or illustrated artifacts.
const negativePhoto = negativeStandard + ", illustration, painting, drawing, art, sketch, 3d render, anime, cartoon, graphic design, canvas texture";

// STRONG (Prestige/3D) - Absolute Enforcement for Rendered Assets.
// Used for Wallpapers and 3D Craft. Kills clutter but allows cinematic lighting.
const negativeStrong = negativeStandard + ", bad proportions, mutated, malformed, fused fingers, asymmetric face, poorly drawn, unfinished, cluttered, disorganized, unkempt, compression artifacts";

// STRUCTURAL (Flat/PPT/TikZ) - The Blueprint Tier.
// Used EXCLUSIVELY for Presentations and Commercial Design.
// Ruthlessly kills 3D, shadows, lighting, realism, and canvas textures to ensure replicable vector shapes.
const negativeStructural = negativeStandard + ", 3d, render, drop shadow, gradients, volumetric lighting, photorealistic, realistic, cinematic, depth of field, bevel, messy brushstrokes, cluttered, disorganized, canvas texture, paper grain, embossed, noise";

// ==========================================
// 3. UI (The Organized Toolkit)
// ==========================================

const ui = requestFromUser("Creative Toolkit", "Run Sweep", function () {
  return [
    this.section("Seed", "Composition Control", [
      this.segmented(0, ["Same seed", "Random per style"])
    ]),
    this.section("Negative Prompt", "Handling UI Negative Prompt", [
      this.segmented(0, ["Append", "Replace"])
    ]),
    this.section("PILLAR 1: VISUAL ARTS", "Foundational Mediums", [
      this.switch(true, "📷 Photography & Cinematic"),
      this.switch(true, "🎨 Fine Art & Painting")
    ]),
    this.section("PILLAR 2: DESIGN & UTILITY", "Professional Assets", [
      this.switch(false, "🎬 Pop Culture & Animation"),
      this.switch(false, "📊 Presentation Graphics"),
      this.switch(false, "📢 Commercial, Events & Ink"), // Updated label
      this.switch(true, "🖼️ Wallpaper, 3D & Concepts")   // Updated label
    ]),
    this.section("PILLAR 3: WORLD BUILDING", "Thematic & Environmental", [
      this.switch(true, "⚔️ Genre & Storytelling"),
      this.switch(true, "📜 History & Eras"),
      this.switch(true, "🗺️ Culture & Heritage"),
      this.switch(true, "🌲 Environment & Atmosphere"),
      this.switch(true, "🧵 Craft & Texture")
    ])
  ];
});

// ==========================================
// 4. PARSE UI SELECTIONS & ASSIGN TIERS
// ==========================================

const REUSE_MASTER_SEED = ui[0][0] === 0;
const APPEND_UI_NEGATIVE = ui[1][0] === 0;
const STRENGTH = 1.0; // txt2img always uses 1.0

const queuedBlocks = [];

// Group 1: VISUAL ARTS (Texture is good - Use Light/Standard)
if (ui[2][0]) queuedBlocks.push({ styles: blockPhotography, tier: negativePhoto });
if (ui[2][1]) queuedBlocks.push({ styles: blockFineArt, tier: negativeLight });

// Group 2: DESIGN & UTILITY 
if (ui[3][0]) queuedBlocks.push({ styles: blockPopCulture, tier: negativeStandard });
if (ui[3][1]) queuedBlocks.push({ styles: blockPresentations, tier: negativeStructural }); // Forces flat 2D primitives
if (ui[3][2]) queuedBlocks.push({ styles: blockCommercialDesign, tier: negativeStructural }); // Forces clean branding
if (ui[3][3]) queuedBlocks.push({ styles: blockWallpaper, tier: negativeStrong }); // Keeps cinematic 3D capability

// Group 3: WORLD BUILDING (Mixed needs)
if (ui[4][0]) queuedBlocks.push({ styles: blockGenre, tier: negativeStandard });
if (ui[4][1]) queuedBlocks.push({ styles: blockHistory, tier: negativeLight }); // Preserves historical canvas textures
if (ui[4][2]) queuedBlocks.push({ styles: blockCulture, tier: negativeStandard });
if (ui[4][3]) queuedBlocks.push({ styles: blockEnvironment, tier: negativeStandard });
if (ui[4][4]) queuedBlocks.push({ styles: blockCraft, tier: negativeStrong }); // Strong forces clean 3D papercraft edges

// ==========================================
// 5. THE ENGINE
// ==========================================

let basePrompt = (pipeline.prompts && pipeline.prompts.prompt) || "A mysterious castle on a cliff";
const masterSeed = Math.floor(Math.random() * 4294967295);

// Calculate total styles for the progress counter
let totalStyles = 0;
queuedBlocks.forEach(block => totalStyles += block.styles.length);

console.log("Autonomous Toolkit Sweep starting...");
console.log("Subject: " + basePrompt);
console.log("Total styles queued: " + totalStyles);

async function runSweeper() {
  let currentIndex = 1;

  for (let b = 0; b < queuedBlocks.length; b++) {
    const currentBlock = queuedBlocks[b];
    const activeNegativeTier = currentBlock.tier;

    for (let i = 0; i < currentBlock.styles.length; i++) {
      const finalPrompt = currentBlock.styles[i].replace("{prompt}", basePrompt);
      console.log("[" + currentIndex + "/" + totalStyles + "] " + currentBlock.styles[i]);

      let cleanConfig = Object.assign({}, pipeline.configuration);

      // txt2img always uses full denoising/strength and clears image/mask refs
      delete cleanConfig.image;
      delete cleanConfig.maskImage;
      cleanConfig.strength = STRENGTH;
      cleanConfig.denoisingStrength = STRENGTH;

      const uiNegative = cleanConfig.negativePrompt || "";
      cleanConfig.negativePrompt = APPEND_UI_NEGATIVE
        ? (uiNegative ? uiNegative + ", " + activeNegativeTier : activeNegativeTier)
        : activeNegativeTier;

      const seedToUse = REUSE_MASTER_SEED
        ? masterSeed
        : Math.floor(Math.random() * 4294967295);

      cleanConfig.seed = seedToUse;

      await pipeline.run({
        configuration: cleanConfig,
        prompt: finalPrompt,
        seed: seedToUse
      });

      currentIndex++;
    }
  }
  console.log("Sweep complete! " + totalStyles + " styles rendered.");
}

runSweeper();
