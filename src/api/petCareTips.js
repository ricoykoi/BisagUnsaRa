const petCareTips = [
  // Original tips (ID 1-8)
  {
    id: 1,
    title: "Feeding Schedule",
    category: "dogs",
    tip: "Feed adult dogs twice a day at regular times. Puppies need 3-4 smaller meals daily."
  },
  {
    id: 2,
    title: "Litter Box Maintenance",
    category: "cats",
    tip: "Clean the litter box daily and change all litter weekly to prevent odors and infections."
  },
  {
    id: 3,
    title: "Exercise Needs",
    category: "dogs",
    tip: "Most dogs need 30 minutes to 2 hours of exercise daily, depending on breed and age."
  },
  {
    id: 4,
    title: "Hydration",
    category: "general",
    tip: "Always provide fresh, clean water. Change water at least once a day."
  },
  {
    id: 5,
    title: "Grooming",
    category: "cats",
    tip: "Brush your cat weekly to reduce shedding and prevent hairballs."
  },
  {
    id: 6,
    title: "Dental Care",
    category: "general",
    tip: "Brush your pet's teeth regularly or provide dental treats to prevent dental disease."
  },
  {
    id: 7,
    title: "Bird Cage Cleaning",
    category: "birds",
    tip: "Clean food and water dishes daily. Replace cage liner and wipe surfaces 2-3 times weekly."
  },
  {
    id: 8,
    title: "Fish Tank Maintenance",
    category: "fish",
    tip: "Change 25% of tank water weekly and test water parameters regularly."
  },

  // Previous additional tips (ID 9-33)
  {
    id: 9,
    title: "Socialization",
    category: "dogs",
    tip: "Socialize puppies with various people, animals, and environments during 3-14 weeks of age."
  },
  {
    id: 10,
    title: "Scratching Posts",
    category: "cats",
    tip: "Provide scratching posts to satisfy natural scratching behavior and protect your furniture."
  },
  {
    id: 11,
    title: "Flight Time",
    category: "birds",
    tip: "Allow pet birds supervised out-of-cage flight time daily in a safe, bird-proofed room."
  },
  {
    id: 12,
    title: "Overfeeding Prevention",
    category: "fish",
    tip: "Feed only what fish can consume in 2-3 minutes, once or twice daily. Overfeeding pollutes water."
  },
  {
    id: 13,
    title: "Veterinary Visits",
    category: "general",
    tip: "Schedule annual wellness exams for all pets, even if they appear healthy."
  },
  {
    id: 14,
    title: "Leash Training",
    category: "dogs",
    tip: "Start leash training early with positive reinforcement. Use a properly fitted harness or collar."
  },
  {
    id: 15,
    title: "Vertical Space",
    category: "cats",
    tip: "Cats love heights. Provide cat trees, shelves, or window perches for climbing and observation."
  },
  {
    id: 16,
    title: "Mental Stimulation",
    category: "dogs",
    tip: "Use puzzle toys, training sessions, and scent games to prevent boredom and destructive behavior."
  },
  {
    id: 17,
    title: "Temperature Regulation",
    category: "birds",
    tip: "Keep birds away from drafts, direct sunlight, and sudden temperature changes. Most need 65-80°F."
  },
  {
    id: 18,
    title: "Tank Cycling",
    category: "fish",
    tip: "Cycle a new aquarium for 4-6 weeks before adding fish to establish beneficial bacteria."
  },
  {
    id: 19,
    title: "Identification",
    category: "general",
    tip: "Ensure all pets have proper ID: microchip, collar tags, or leg bands (for birds)."
  },
  {
    id: 20,
    title: "Nail Trimming",
    category: "dogs",
    tip: "Trim your dog's nails every 3-4 weeks. If you hear clicking on floors, it's time for a trim."
  },
  {
    id: 21,
    title: "Play Behavior",
    category: "cats",
    tip: "Engage in daily interactive play sessions with wand toys to satisfy hunting instincts."
  },
  {
    id: 22,
    title: "Diet Variety",
    category: "birds",
    tip: "Offer a balanced diet of pellets, fresh vegetables, and limited fruits. Avoid avocado and chocolate."
  },
  {
    id: 23,
    title: "Proper Filtration",
    category: "fish",
    tip: "Choose a filter rated for your tank size and clean/media replacement according to manufacturer instructions."
  },
  {
    id: 24,
    title: "Toxic Substance Awareness",
    category: "general",
    tip: "Keep human medications, cleaning products, and toxic foods (chocolate, grapes, etc.) secured away."
  },
  {
    id: 25,
    title: "Deshedding Tools",
    category: "dogs",
    tip: "Use undercoat rakes and deshedding tools during seasonal coat blows to manage heavy shedding."
  },
  {
    id: 26,
    title: "Hiding Places",
    category: "cats",
    tip: "Provide hiding spots like boxes or covered beds where cats can retreat when stressed."
  },
  {
    id: 27,
    title: "UV Lighting",
    category: "birds",
    tip: "Provide full-spectrum UV lighting for birds kept indoors, as it's essential for vitamin D synthesis."
  },
  {
    id: 28,
    title: "Acclimation Process",
    category: "fish",
    tip: "Float new fish in their bag in the tank for 15-20 minutes to equalize temperature before releasing."
  },
  {
    id: 29,
    title: "Emergency Preparedness",
    category: "general",
    tip: "Have a pet emergency kit ready with food, medications, medical records, and a recent photo."
  },
  {
    id: 30,
    title: "Senior Pet Care",
    category: "general",
    tip: "Increase veterinary visits to twice yearly for senior pets and adjust diet/exercise for aging needs."
  },
  {
    id: 31,
    title: "Positive Reinforcement",
    category: "dogs",
    tip: "Use treats, praise, and play to reward desired behaviors rather than punishment for unwanted ones."
  },
  {
    id: 32,
    title: "Multiple Litter Boxes",
    category: "cats",
    tip: "Provide one litter box per cat plus one extra, placed in different, quiet locations."
  },
  {
    id: 33,
    title: "Bathing Needs",
    category: "birds",
    tip: "Offer a shallow water dish for bathing or mist your bird with water 2-3 times weekly."
  },

  // NEW ADDITIONAL TIPS (ID 34-58)
  {
    id: 34,
    title: "Crate Training",
    category: "dogs",
    tip: "Make the crate a positive space with treats and toys. Never use it for punishment."
  },
  {
    id: 35,
    title: "Weight Management",
    category: "dogs",
    tip: "Monitor your dog's weight and adjust food portions accordingly. Feel for ribs - you should be able to feel them easily."
  },
  {
    id: 36,
    title: "Paw Care",
    category: "dogs",
    tip: "Check paws regularly for cuts, cracks, or foreign objects. Use paw balm in extreme weather."
  },
  {
    id: 37,
    title: "Ear Cleaning",
    category: "dogs",
    tip: "Clean ears weekly with vet-approved solution, especially for breeds with floppy ears prone to infections."
  },
  {
    id: 38,
    title: "Recall Training",
    category: "dogs",
    tip: "Practice recall commands in safe, enclosed areas with high-value rewards for consistent response."
  },
  {
    id: 39,
    title: "Cat Enrichment",
    category: "cats",
    tip: "Rotate toys weekly to maintain interest. Hide treats in puzzle feeders for mental stimulation."
  },
  {
    id: 40,
    title: "Cat Communication",
    category: "cats",
    tip: "Learn to read tail positions and ear movements. A slow blink is a 'cat kiss' showing trust."
  },
  {
    id: 41,
    title: "Litter Preference",
    category: "cats",
    tip: "Offer different litter types to find your cat's preference. Most prefer unscented, clumping litter."
  },
  {
    id: 42,
    title: "Indoor Safety",
    category: "cats",
    tip: "Secure windows with screens, hide electrical cords, and remove toxic plants like lilies."
  },
  {
    id: 43,
    title: "Cat Introductions",
    category: "cats",
    tip: "Introduce new cats slowly over 1-2 weeks with scent swapping before visual contact."
  },
  {
    id: 44,
    title: "Bird Social Needs",
    category: "birds",
    tip: "Spend at least 1-2 hours daily interacting with your bird. Some species need same-species companionship."
  },
  {
    id: 45,
    title: "Molt Support",
    category: "birds",
    tip: "During molting, provide extra protein and consider adding a humidifier to ease feather growth."
  },
  {
    id: 46,
    title: "Wing Clipping",
    category: "birds",
    tip: "If clipping wings, leave enough feathers for controlled gliding. Consult an avian vet or groomer."
  },
  {
    id: 47,
    title: "Noise Sensitivity",
    category: "birds",
    tip: "Cover the cage partially during loud events (parties, storms) to reduce stress from noise."
  },
  {
    id: 48,
    title: "Water Quality",
    category: "fish",
    tip: "Use dechlorinator for tap water. Test for ammonia, nitrites, and nitrates weekly in established tanks."
  },
  {
    id: 49,
    title: "Tank Size",
    category: "fish",
    tip: "Research adult size of fish before purchase. A common guideline is 1 gallon per inch of fish minimum."
  },
  {
    id: 50,
    title: "Quarantine Protocol",
    category: "fish",
    tip: "Quarantine new fish in a separate tank for 2-4 weeks before adding to main aquarium to prevent disease spread."
  },
  {
    id: 51,
    title: "Live Plants",
    category: "fish",
    tip: "Consider live plants - they absorb nitrates, provide oxygen, and offer natural hiding places."
  },
  {
    id: 52,
    title: "Grooming Frequency",
    category: "general",
    tip: "Establish a regular grooming routine appropriate for your pet's coat type and species needs."
  },
  {
    id: 53,
    title: "Parasite Prevention",
    category: "general",
    tip: "Use veterinarian-recommended flea, tick, and worm prevention year-round based on your location."
  },
  {
    id: 54,
    title: "Behavioral Changes",
    category: "general",
    tip: "Sudden behavioral changes often indicate illness or pain. Consult your vet if you notice significant changes."
  },
  {
    id: 55,
    title: "Travel Safety",
    category: "general",
    tip: "Use appropriate carriers for transport. Never leave pets unattended in vehicles, especially in warm weather."
  },
  {
    id: 56,
    title: "Spay/Neuter Benefits",
    category: "general",
    tip: "Consider spaying/neutering to prevent certain cancers and reduce behavioral issues. Discuss timing with your vet."
  },
  {
    id: 57,
    title: "Allergy Management",
    category: "general",
    tip: "If family members have allergies, consider hypoallergenic breeds and use air purifiers with HEPA filters."
  },
  {
    id: 58,
    title: "Bonding Time",
    category: "general",
    tip: "Dedicate quality one-on-one time daily with each pet to strengthen your bond and monitor their wellbeing."
  },
  {
    id: 59,
    title: "Heat Safety",
    category: "dogs",
    tip: "Never walk dogs on hot pavement. Test with your hand - if it's too hot for you, it's too hot for their paws."
  },
  {
    id: 60,
    title: "Breed Research",
    category: "dogs",
    tip: "Research breed characteristics thoroughly before adoption. Energy levels, grooming needs, and temperament vary greatly."
  },
  {
    id: 61,
    title: "Anal Gland Care",
    category: "dogs",
    tip: "Monitor for scooting or licking - signs that anal glands may need expression. Consult your groomer or vet."
  },
  {
    id: 62,
    title: "Joint Health",
    category: "dogs",
    tip: "Consider joint supplements like glucosamine for large breeds and senior dogs to support mobility."
  },
  {
    id: 63,
    title: "Car Anxiety",
    category: "dogs",
    tip: "Start with short car trips to build positive associations. Use calming aids or consult your vet for severe anxiety."
  },
  {
    id: 64,
    title: "Cat Hydration",
    category: "cats",
    tip: "Many cats prefer running water. Consider a pet fountain to encourage drinking and prevent urinary issues."
  },
  {
    id: 65,
    title: "Whisker Fatigue",
    category: "cats",
    tip: "Use wide, shallow food dishes to prevent whisker stress. Cats' whiskers are highly sensitive."
  },
  {
    id: 66,
    title: "Catio Benefits",
    category: "cats",
    tip: "Create a secure outdoor enclosure (catio) for safe outdoor enrichment without the risks of free roaming."
  },
  {
    id: 67,
    title: "Multi-Cat Dynamics",
    category: "cats",
    tip: "Observe feeding times - some cats eat quickly then bully others. Separate if needed during meals."
  },
  {
    id: 68,
    title: "Feline Obesity",
    category: "cats",
    tip: "Use slow feeder bowls and food puzzles to prevent rapid eating. Measure portions carefully."
  },
  {
    id: 69,
    title: "Bird Vocalizations",
    category: "birds",
    tip: "Learn your bird's normal vocal patterns. Increased screaming or silence can indicate stress or illness."
  },
  {
    id: 70,
    title: "Foraging Enrichment",
    category: "birds",
    tip: "Hide treats in foraging toys or wrapped in paper to stimulate natural foraging behavior."
  },
  {
    id: 71,
    title: "Night Covers",
    category: "birds",
    tip: "Cover the cage at night for 10-12 hours to ensure proper sleep. Use breathable fabric."
  },
  {
    id: 72,
    title: "Calcium Sources",
    category: "birds",
    tip: "Provide cuttlebone or mineral blocks for essential calcium, especially important for egg-laying females."
  },
  {
    id: 73,
    title: "Fish Stress Signs",
    category: "fish",
    tip: "Watch for clamped fins, rapid gill movement, or hiding - these indicate stress. Check water quality immediately."
  },
  {
    id: 74,
    title: "Algae Control",
    category: "fish",
    tip: "Control algae naturally with algae-eating fish, snails, or reducing light exposure to 8-10 hours daily."
  },
  {
    id: 75,
    title: "Salt Baths",
    category: "fish",
    tip: "Use aquarium salt baths for minor injuries or parasites, but research proper dosing for your species."
  },
  {
    id: 76,
    title: "Breeding Prevention",
    category: "fish",
    tip: "Separate males and females or provide ample hiding spots for fry if you don't want uncontrolled breeding."
  },
  {
    id: 77,
    title: "Pet Insurance",
    category: "general",
    tip: "Consider pet insurance early, before pre-existing conditions develop. Compare coverage and exclusions carefully."
  },
  {
    id: 78,
    title: "Fireworks Safety",
    category: "general",
    tip: "Create a safe, quiet space during fireworks. Use white noise, close curtains, and consider anxiety wraps."
  },
  {
    id: 79,
    title: "Household Hazards",
    category: "general",
    tip: "Secure trash cans, close toilet lids, and keep small objects off floors to prevent choking hazards."
  },
  {
    id: 80,
    title: "Pet Sitter Prep",
    category: "general",
    tip: "Leave detailed instructions including vet contact, feeding schedule, and emergency contacts for pet sitters."
  },
  {
    id: 81,
    title: "Allergy Testing",
    category: "dogs",
    tip: "If your dog has chronic ear infections or itching, discuss allergy testing with your veterinarian."
  },
  {
    id: 82,
    title: "Puppy Teething",
    category: "dogs",
    tip: "Provide frozen carrots or specialized teething toys to soothe sore gums during the teething phase (3-6 months)."
  },
  {
    id: 83,
    title: "Senior Dog Adjustments",
    category: "dogs",
    tip: "Add ramps or stairs for furniture access. Provide orthopedic beds and consider shorter, more frequent walks."
  },
  {
    id: 84,
    title: "Resource Guarding",
    category: "dogs",
    tip: "Address resource guarding early by trading up (offering higher value items) rather than taking things away."
  },
  {
    id: 85,
    title: "Dog Park Etiquette",
    category: "dogs",
    tip: "Only bring well-socialized dogs to dog parks. Monitor play closely and leave if play becomes too rough."
  },
  {
    id: 86,
    title: "Cat Diabetes Prevention",
    category: "cats",
    tip: "Feed high-protein, low-carbohydrate diets and maintain healthy weight to reduce diabetes risk."
  },
  {
    id: 87,
    title: "Senior Cat Care",
    category: "cats",
    tip: "Elevate food and water bowls for arthritic cats. Provide low-sided litter boxes for easy access."
  },
  {
    id: 88,
    title: "Cat Grass Benefits",
    category: "cats",
    tip: "Grow cat grass (wheat or oat) to aid digestion and deter chewing on houseplants, many of which are toxic."
  },
  {
    id: 89,
    title: "Feline Arthritis",
    category: "cats",
    tip: "Watch for subtle signs: reluctance to jump, stiffness, or decreased grooming. Consult your vet for pain management."
  },
  {
    id: 90,
    title: "Interactive Feeding",
    category: "cats",
    tip: "Use food-dispensing toys to make mealtime last longer and provide mental stimulation."
  },
  {
    id: 91,
    title: "Bird Dust Control",
    category: "birds",
    tip: "Some birds (cockatoos, cockatiels) produce powder down. Use air purifiers and frequent cleaning to manage dust."
  },
  {
    id: 92,
    title: "Beak Maintenance",
    category: "birds",
    tip: "Provide natural wood perches of varying diameters and textured toys for natural beak wear."
  },
  {
    id: 93,
    title: "Molting Comfort",
    category: "birds",
    tip: "Offer warm mist showers to soothe itchy skin during heavy molts. Increase protein in diet."
  },
  {
    id: 94,
    title: "Bird-Safe Cooking",
    category: "birds",
    tip: "Avoid non-stick cookware (PTFE/PFOA) which releases toxic fumes when overheated, deadly to birds."
  },
  {
    id: 95,
    title: "Aquarium Lighting",
    category: "fish",
    tip: "Use timer-controlled lights to maintain consistent day/night cycles. Most fish need 8-12 hours of light daily."
  },
  {
    id: 96,
    title: "Water Change Technique",
    category: "fish",
    tip: "When changing water, match temperature and treat with dechlorinator before adding to tank to minimize stress."
  },
  {
    id: 97,
    title: "Quarantine Tank Setup",
    category: "fish",
    tip: "Keep a small, fully cycled quarantine tank ready for new fish or treating sick ones without medication main tank."
  },
  {
    id: 98,
    title: "pH Stability",
    category: "fish",
    tip: "Sudden pH changes are more harmful than imperfect pH. Make gradual adjustments if needed."
  },
  {
    id: 99,
    title: "Raw Diet Caution",
    category: "general",
    tip: "If feeding raw, follow strict hygiene protocols and consult a veterinary nutritionist for balanced recipes."
  },
  {
    id: 100,
    title: "Medication Administration",
    category: "general",
    tip: "Learn proper techniques for giving pills/liquids. Never crush medications without vet approval."
  },
  {
    id: 101,
    title: "Seasonal Awareness",
    category: "general",
    tip: "Adjust care seasonally: winter paw protection, summer heat safety, spring allergy management."
  },
  {
    id: 102,
    title: "Pet First Aid Kit",
    category: "general",
    tip: "Include gauze, antiseptic, digital thermometer, tweezers, and emergency vet numbers in your pet first aid kit."
  },
  {
    id: 103,
    title: "Adoption Transition",
    category: "general",
    tip: "Give newly adopted pets a quiet space to decompress for several days before introducing them to the whole household."
  },
  {
    id: 104,
    title: "End-of-Life Care",
    category: "general",
    tip: "Discuss quality of life scales with your vet. Consider hospice care options when facing terminal illness."
  },
  {
    id: 105,
    title: "Pet Photography",
    category: "general",
    tip: "Take clear photos regularly for identification purposes and to document changes that might indicate health issues."
  },
  {
    id: 106,
    title: "Noise Desensitization",
    category: "general",
    tip: "Gradually expose pets to household noises (vacuum, doorbell) at low volumes while giving treats to build positive associations."
  },
  {
    id: 107,
    title: "Alternative Therapies",
    category: "general",
    tip: "Consider acupuncture, physical therapy, or laser therapy for chronic conditions, but always consult your vet first."
  },
  {
    id: 108,
    title: "Community Resources",
    category: "general",
    tip: "Research local resources: low-cost clinics, pet food banks, behaviorists, and 24-hour emergency facilities before you need them."
  },
  {
    id: 109,
    title: "Puppy Socialization Classes",
    category: "dogs",
    tip: "Enroll in puppy socialization classes between 8-16 weeks to build confidence and learn proper dog-dog interaction."
  },
  {
    id: 110,
    title: "Rainy Day Enrichment",
    category: "dogs",
    tip: "Create indoor obstacle courses with household items for mental stimulation when outdoor exercise isn't possible."
  },
  {
    id: 111,
    title: "Sensitive Stomach Management",
    category: "dogs",
    tip: "For dogs with sensitive stomachs, consider limited ingredient diets and transition foods slowly over 7-10 days."
  },
  {
    id: 112,
    title: "Doggy Daycare Selection",
    category: "dogs",
    tip: "Tour facilities, check staff-to-dog ratios, and observe playgroups before committing to a doggy daycare."
  },
  {
    id: 113,
    title: "Seasonal Shedding",
    category: "dogs",
    tip: "Increase brushing frequency during seasonal sheds (spring and fall) to prevent matting and reduce household hair."
  },
  {
    id: 114,
    title: "Cat Window Entertainment",
    category: "cats",
    tip: "Install bird feeders outside windows or use cat TV videos to provide visual stimulation for indoor cats."
  },
  {
    id: 115,
    title: "Multiple Cat Resources",
    category: "cats",
    tip: "In multi-cat homes, provide separate feeding stations and water sources to reduce competition and stress."
  },
  {
    id: 116,
    title: "Catnip Alternatives",
    category: "cats",
    tip: "Try silvervine or valerian root as alternatives to catnip - some cats who don't respond to catnip love these."
  },
  {
    id: 117,
    title: "Feline Dental Health",
    category: "cats",
    tip: "Schedule regular dental cleanings as many cats develop periodontal disease by age 3. Start brushing early."
  },
  {
    id: 118,
    title: "Cat Body Language",
    category: "cats",
    tip: "Learn the 'puffy tail' signal - a bushy tail indicates fear or aggression, not playfulness."
  },
  {
    id: 119,
    title: "Bird Toy Safety",
    category: "birds",
    tip: "Regularly inspect toys for frayed ropes, loose parts, or sharp edges that could cause injury."
  },
  {
    id: 120,
    title: "Feather Plucking Prevention",
    category: "birds",
    tip: "Address feather plucking immediately - causes can include boredom, poor diet, illness, or environmental stress."
  },
  {
    id: 121,
    title: "Bird Nail Maintenance",
    category: "birds",
    tip: "Use concrete or sandy perches to help naturally file nails, but still check and trim as needed."
  },
  {
    id: 122,
    title: "Air Quality Awareness",
    category: "birds",
    tip: "Birds have sensitive respiratory systems. Avoid aerosols, scented candles, and smoking around them."
  },
  {
    id: 123,
    title: "Fish Compatibility Research",
    category: "fish",
    tip: "Research temperament and size compatibility before mixing fish species. Some are territorial or aggressive."
  },
  {
    id: 124,
    title: "Plant Fertilizer Safety",
    category: "fish",
    tip: "If using live plants, choose aquarium-safe fertilizers. Some plant fertilizers contain copper toxic to invertebrates."
  },
  {
    id: 125,
    title: "Hospital Tank Setup",
    category: "fish",
    tip: "Keep a spare heater and sponge filter ready for hospital/quarantine tanks to avoid medicating the main tank."
  },
  {
    id: 126,
    title: "Bacterial Bloom Management",
    category: "fish",
    tip: "Cloudy water in new tanks is usually a bacterial bloom. Wait it out - it typically clears in a few days."
  },
  {
    id: 127,
    title: "Microchip Updates",
    category: "general",
    tip: "Keep microchip registration information current with your contact details whenever you move or change phone numbers."
  },
  {
    id: 128,
    title: "Household Plant Safety",
    category: "general",
    tip: "Research every houseplant's toxicity. Common toxic plants include lilies (cats), sago palms (dogs), and philodendron."
  },
  {
    id: 129,
    title: "Pet-proofing Holidays",
    category: "general",
    tip: "Secure Christmas trees, keep tinsel away from cats, and ensure pets can't access holiday foods or decorations."
  },
  {
    id: 130,
    title: "Temperature Extremes",
    category: "general",
    tip: "Provide cooling mats in summer and warm bedding in winter. Adjust indoor temperatures for pet comfort."
  },
  {
    id: 131,
    title: "CBD Oil Considerations",
    category: "general",
    tip: "If considering CBD, consult your vet first, use pet-specific products, and start with low doses."
  },
  {
    id: 132,
    title: "Service Animal Awareness",
    category: "general",
    tip: "Never distract service animals while they're working. Teach children to ask before petting any animal."
  },
  {
    id: 133,
    title: "Canine Enrichment Ideas",
    category: "dogs",
    tip: "Use snuffle mats, frozen Kongs, and treat-dispensing balls to provide mental stimulation and slow down eating."
  },
  {
    id: 134,
    title: "Puppy Bite Inhibition",
    category: "dogs",
    tip: "Teach bite inhibition by yelping when bitten too hard, then redirecting to appropriate chew toys."
  },
  {
    id: 135,
    title: "Senior Dog Nutrition",
    category: "dogs",
    tip: "Switch to senior formulas with joint support and adjusted calorie content around age 7 for most breeds."
  },
  {
    id: 136,
    title: "Dog Beach Safety",
    category: "dogs",
    tip: "Rinse saltwater and sand off after beach visits to prevent skin irritation and ingestion of harmful bacteria."
  },
  {
    id: 137,
    title: "Counter Surfing Prevention",
    category: "dogs",
    tip: "Keep counters clear of food and use deterrents like aluminum foil to discourage counter surfing behavior."
  },
  {
    id: 138,
    title: "Cat Water Consumption",
    category: "cats",
    tip: "Monitor water intake - increased drinking can signal diabetes or kidney issues, while decreased can mean dehydration."
  },
  {
    id: 139,
    title: "Feline Hyperthyroidism Signs",
    category: "cats",
    tip: "Watch for weight loss despite increased appetite, hyperactivity, and increased vocalization in middle-aged to senior cats."
  },
  {
    id: 140,
    title: "Cat Carrier Training",
    category: "cats",
    tip: "Leave carriers out year-round with cozy bedding inside to create positive associations, not just for vet visits."
  },
  {
    id: 141,
    title: "Interactive Play Timing",
    category: "cats",
    tip: "Schedule play sessions before meals to mimic natural hunt-eat-groom-sleep cycles for indoor cats."
  },
  {
    id: 142,
    title: "Multi-cat Introduction",
    category: "cats",
    tip: "Use pheromone diffusers during new cat introductions to reduce tension and promote calm interactions."
  },
  {
    id: 143,
    title: "Bird Sleep Requirements",
    category: "birds",
    tip: "Most birds need 10-12 hours of uninterrupted sleep. Consider a separate sleep cage in a quiet, dark room."
  },
  {
    id: 144,
    title: "Avian Vitamin A Deficiency",
    category: "birds",
    tip: "Prevent vitamin A deficiency by offering dark leafy greens, orange vegetables, and avoiding seed-only diets."
  },
  {
    id: 145,
    title: "Bird First Aid Kit",
    category: "birds",
    tip: "Keep styptic powder for bleeding nails, cornstarch for minor cuts, and a small carrier for emergencies."
  },
  {
    id: 146,
    title: "Molting Diet Adjustment",
    category: "birds",
    tip: "Increase protein (cooked egg, legumes) during heavy molts to support new feather growth."
  },
  {
    id: 147,
    title: "Aquarium Salt Use",
    category: "fish",
    tip: "Use aquarium salt as a general tonic at low doses (1 tsp per gallon) but remove for live plants and scaleless fish."
  },
  {
    id: 148,
    title: "Fish Compatibility Chart",
    category: "fish",
    tip: "Create a compatibility chart before adding new fish - consider size, temperament, water parameters, and swimming levels."
  },
  {
    id: 149,
    title: "Medication Calculations",
    category: "fish",
    tip: "Always calculate medication doses based on actual water volume (tank size minus decorations/substrate), not tank size."
  },
  {
    id: 150,
    title: "Bacterial Starter Cultures",
    category: "fish",
    tip: "Use established filter media or bottled bacteria to jump-start new tanks rather than relying on fish-in cycling."
  },
  {
    id: 151,
    title: "Pet Trust Funds",
    category: "general",
    tip: "Consider setting up a pet trust or including pet care provisions in your will to ensure their care if something happens to you."
  },
  {
    id: 152,
    title: "Natural Disaster Planning",
    category: "general",
    tip: "Include pets in emergency evacuation plans. Keep carriers, food, and medications ready to go."
  },
  {
    id: 153,
    title: "Pet Bereavement Support",
    category: "general",
    tip: "Seek pet loss support groups or hotlines if grieving a pet. The bond is real and grief is valid."
  },
  {
    id: 154,
    title: "Alternative Transportation",
    category: "general",
    tip: "Train pets to travel in carriers for safe car transport. Consider seatbelt harnesses for dogs."
  },
  {
    id: 155,
    title: "Pest Prevention",
    category: "general",
    tip: "Use pet-safe pest control methods. Many insecticides and rodenticides are highly toxic to pets."
  },
  {
    id: 156,
    title: "Weight Monitoring",
    category: "general",
    tip: "Weigh pets monthly and keep records. Sudden weight changes can indicate health issues before other symptoms appear."
  },
  {
    id: 157,
    title: "Pet-friendly Gardening",
    category: "general",
    tip: "Create safe outdoor spaces using pet-safe plants and avoiding cocoa mulch, which contains theobromine."
  },
  {
    id: 158,
    title: "Technology Integration",
    category: "general",
    tip: "Use pet cameras to monitor behavior when you're away, automatic feeders for precise timing, and GPS trackers for outdoor pets."
  }
];

export default petCareTips;
