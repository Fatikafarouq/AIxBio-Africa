export const courseMeta = {
  "title": "Introduction to AI & Biosecurity in Africa",
  "subtitle": "An African Perspective — AIxBio Africa",
  "purpose": "This course introduces participants to biosecurity, how artificial intelligence is changing the field, and what these developments mean for Africa. It explores both how AI can strengthen biosecurity, pandemic preparedness, surveillance, diagnostics, research, and response, and how the same technologies may create new biological risks, misuse concerns, safety challenges, and governance questions. The purpose is not to make participants technical experts in a short course. The aim is to give them a strong foundation, help them think critically about AI and biological security, and prepare them to identify important problems, research questions, and opportunities in African contexts.",
  "whoItsFor": "The course is designed for students, early-career professionals, people looking to transition into the field, and others interested in biology, medicine, veterinary science, public health, computer science and AI, policy, security, social sciences, or emerging technologies. Participants may come from very different educational backgrounds, and no prior expertise in AI or biosecurity is required.",
  "outcomes": [
    "Explain what biosecurity is and why it matters in Africa.",
    "Describe how AI is becoming relevant to biology and biosecurity.",
    "Identify ways AI can strengthen pandemic preparedness and biological security.",
    "Recognize how the same AI capabilities may also create new biological risks.",
    "Explain basic approaches to reducing and governing AI-biosecurity risks.",
    "Think critically about how African institutions, infrastructure, data, resources, health systems, and priorities affect these issues.",
    "Identify an AI-biosecurity problem or research question that deserves further investigation."
  ],
  "learningJourney": [
    "Understand",
    "Connect",
    "Apply",
    "Question",
    "Protect",
    "Act"
  ]
};
export const courseModules = [
  {
    "id": 1,
    "slug": "module-1",
    "title": "What is Biosecurity, and How Does It Apply to Africa?",
    "tagline": "Introduce the core concepts of biosecurity and connect them to African realities.",
    "overview": "This module introduces biosecurity in simple, practical terms. By the end, participants should be able to explain what biosecurity means, distinguish it from related ideas such as biosafety and public health, recognize the main types of biological threats, and understand why biosecurity matters in African contexts.",
    "discussionBlocks": [
      {
        "title": "What is Biosecurity?",
        "points": [
          "Simple meaning of biosecurity and what it aims to protect.",
          "Prevention, preparedness, and response to biological threats."
        ]
      },
      {
        "title": "Biosecurity, Biosafety, and Public Health",
        "points": [
          "What each term means.",
          "Where they overlap and where they differ."
        ]
      },
      {
        "title": "Types of Biological Threats",
        "points": [
          "Natural, accidental, and deliberate threats.",
          "Simple examples of each."
        ]
      },
      {
        "title": "Dual Use",
        "points": [
          "How useful biological knowledge or tools can also create risks.",
          "Why this matters for research and emerging technologies."
        ]
      },
      {
        "title": "Biosecurity in Africa",
        "points": [
          "Why biological threats matter in African contexts.",
          "Key realities such as outbreaks, agriculture, animal health, surveillance, laboratories, and preparedness."
        ]
      }
    ],
    "caseStudy": {
      "title": "Tanzania's 2023 Marburg Outbreak",
      "purpose": [
        "Help learners recognize biosecurity concepts in a real African example.",
        "Show what a biological threat looks like and who can be affected, including patients, health workers, communities, and neighbouring countries.",
        "Show how laboratory testing, isolation, surveillance, contact tracing, infection prevention, and rapid-response teams help reduce harm.",
        "Help learners see the difference and overlap between biosecurity, biosafety, and public health in practice.",
        "Show why laboratories, trained personnel, health systems, cross-border coordination, and preparedness matter for biosecurity in Africa."
      ],
      "discussion": "The case study is not intended to teach participants everything about Marburg or ask them to design an outbreak response. Its purpose is to help beginners recognize the biosecurity concepts introduced in the module in a real African situation.",
      "resource": null
    },
    "resources": [
      {
        "type": "watch",
        "label": "Watch",
        "title": "Video: Community Health Workers' Swift Action on Marburg Virus Disease Alert in Tanzania — U.S. CDC",
        "url": "https://www.youtube.com/watch?v=nEuqVRAihBw",
        "purpose": "show how an unusual biological threat was noticed, reported, and connected to surveillance and outbreak response in a real African setting.",
        "note": "",
        "core": true
      },
      {
        "type": "read",
        "label": "Read",
        "title": "Article: NTI — \"What is Biosecurity — Explained\"",
        "url": "https://www.nti.org/risky-business/what-is-biosecurity-explained/",
        "purpose": "give participants a clear introduction to different definitions of biosecurity, including NTI's focus on deliberate misuse, and connect the concept to emerging technologies.",
        "note": "",
        "core": true
      },
      {
        "type": "read",
        "label": "Read",
        "title": "Article: WHO Africa — How Preparedness Boosted Tanzania's Marburg Outbreak Response",
        "url": "https://www.afro.who.int/news/how-preparedness-boosted-tanzanias-marburg-outbreak-response",
        "purpose": "provide the fuller context for the Tanzania Marburg case, including preparedness, surveillance, testing, contact tracing, rapid response, and coordination.",
        "note": "",
        "core": true
      }
    ],
    "preSessionPrep": [
      "Come prepared to share one moment from the Tanzania Marburg case that showed you biosecurity is broader than just \"stopping disease.\""
    ],
    "preSessionPrepNote": "Participants should come prepared to respond to one prompt: This replaces a traditional quiz and is intended to make sure participants engage with the resources and arrive ready to contribute to the facilitated discussion.",
    "facilitatorNotes": [
      "Open by asking participants what they think biosecurity means before giving a formal definition.",
      "Use the five core blocks to guide the conversation rather than lecture through them.",
      "Bring in the Tanzania Marburg case after the basic concepts so participants can recognize those ideas in practice.",
      "Use the resource takeaway prompt to begin discussion from what participants noticed themselves.",
      "Keep the focus on clarity and examples; avoid going too deep into technical policy, laboratory standards, or advanced biosecurity concepts."
    ],
    "moduleLearningFlow": "Introduce core concepts → recognize them in the Tanzania Marburg case → connect biosecurity to African realities → carry the concept of dual use into Module 2."
  },
  {
    "id": 2,
    "slug": "module-2",
    "title": "Where Does AI Fit Into Biosecurity?",
    "tagline": "Understand what AI can do in health and biology, and why those capabilities matter for biosecurity.",
    "overview": "This module helps participants understand, in simple terms, how AI is beginning to affect biology, health, and biosecurity. The goal is not to teach the technical details of AI, but to show what AI can help people do and why those capabilities matter for biological security.",
    "discussionBlocks": [
      {
        "title": "What Do We Mean by AI in This Course?",
        "points": [
          "A simple explanation of AI as systems that can analyse information, identify patterns, generate outputs, and support decisions.",
          "Focus on what AI can do, not how it is technically built."
        ]
      },
      {
        "title": "Where Is AI Already Showing Up in Health and Biology?",
        "points": [
          "Simple examples such as disease surveillance, diagnostics, scientific research, and analysing large amounts of health or biological data.",
          "Show that AI is becoming part of how researchers and health systems work."
        ]
      },
      {
        "title": "Why Does This Matter for Biosecurity?",
        "points": [
          "AI can make some tasks faster, easier, or possible at a larger scale.",
          "That can change how biological threats are detected, understood, and managed."
        ]
      },
      {
        "title": "The Same Capability Can Have Different Uses",
        "points": [
          "Introduce the idea that an AI capability can be helpful in one setting and create risks in another.",
          "Keep this introductory; Modules 3 and 4 will explore the benefits and risks more deeply."
        ]
      },
      {
        "title": "What Does This Mean for Africa?",
        "points": [
          "Consider access to AI tools, local expertise, health and biological data, infrastructure, and dependence on technologies developed elsewhere.",
          "Ask how African countries can benefit from these capabilities while still thinking carefully about their implications."
        ]
      },
      {
        "title": "Simple Examples for the Discussion",
        "points": [
          "Disease surveillance: AI can help look through large amounts of health data for unusual patterns.",
          "Diagnostics: AI can help interpret information that may support faster disease detection.",
          "Research: AI can help researchers search, analyse, and make sense of scientific information more quickly.",
          "AI matters for biosecurity because it can change what people are able to do with biological and health information — and how quickly they can do it."
        ]
      }
    ],
    "caseStudy": {
      "title": "Transforming South Africa's TB Care Landscape with AI",
      "purpose": [
        "Show a real African example of AI being used to support disease detection and healthcare.",
        "Help participants see how AI can change what health workers and health systems are able to do.",
        "Connect an understandable AI capability to a real biological and public-health challenge.",
        "Give participants a concrete example they can return to when discussing benefits in Module 3 and risks in Module 4.",
        "Keep the case study focused on recognizing what AI enables, rather than asking participants to evaluate the technology in depth at this stage."
      ],
      "discussion": "",
      "resource": {
        "label": "Video: Transforming South Africa's TB Care Landscape with AI — Qure.ai, 25 April 2023",
        "url": "https://www.youtube.com/watch?v=D644w2dXs7Q"
      }
    },
    "resources": [
      {
        "type": "watch",
        "label": "Watch",
        "title": "Video: How AI Is Revolutionizing Medicine — Bloomberg Originals",
        "url": "https://www.youtube.com/watch?v=FqsvgFTQv8w",
        "purpose": "give participants a simple, real-world introduction to how AI can analyse health information, support diagnosis, and change what health professionals are able to do.",
        "note": "",
        "core": true
      },
      {
        "type": "read",
        "label": "Read",
        "title": "Article: Researchers in Africa are using AI to fill the global health care gap — Global Voices, 5 February 2026",
        "url": "https://globalvoices.org/2026/02/05/researchers-in-africa-are-using-ai-to-fill-the-global-health-care-gap/",
        "purpose": "show participants concrete examples of how AI is already being used in African healthcare and help them think about what increasing AI capability could mean for health and biosecurity on the continent.",
        "note": "",
        "core": true
      }
    ],
    "preSessionPrep": [
      "Come prepared to share one thing the South Africa TB case showed you about how AI can change what health workers or health systems are able to do."
    ],
    "preSessionPrepNote": "Participants should come prepared to respond to one prompt: This is intended to bring participants into the facilitated session ready to discuss a concrete example of AI capability.",
    "facilitatorNotes": [
      "Keep the discussion focused on what AI can help people do, not on how AI systems are technically built.",
      "Use the South Africa TB case and other simple examples to connect AI with health, biology, and biosecurity.",
      "Introduce dual use only as a basic idea here; save the deeper benefits and risks for Modules 3 and 4.",
      "Keep bringing the conversation back to what these AI capabilities could mean in African contexts.",
      "Avoid turning the session into a general \"AI in healthcare\" discussion; the goal is to show why increasing AI capability matters for biosecurity."
    ],
    "moduleLearningFlow": "Introduce AI as a capability → show where it is already showing up in African health and biology → introduce dual use lightly → carry the idea of AI capability into Module 3, where benefits are explored in depth."
  },
  {
    "id": 3,
    "slug": "module-3",
    "title": "How Can AI Strengthen Biosecurity in Africa?",
    "tagline": "Explore practical ways AI could strengthen prevention, detection, preparedness, and response in African contexts.",
    "overview": "This module helps participants understand how AI can be used to prevent, detect, prepare for, and respond to biological threats in African contexts. The focus is on practical ways AI can strengthen existing biosecurity and public-health systems rather than treating AI as a solution on its own.",
    "discussionBlocks": [
      {
        "title": "AI for Early Warning and Disease Surveillance",
        "points": [
          "How AI can help identify unusual patterns in health, outbreak, mobility, environmental, or surveillance data.",
          "Why detecting biological threats earlier can improve response."
        ]
      },
      {
        "title": "AI for Testing and Diagnostics",
        "points": [
          "How AI can support faster or more accessible disease detection.",
          "Why this may matter in places where specialist capacity is limited."
        ]
      },
      {
        "title": "AI for Pandemic Preparedness and Response",
        "points": [
          "How AI can support forecasting, scenario planning, resource allocation, and decision-making before and during outbreaks.",
          "AI should be presented as supporting preparedness systems rather than replacing them."
        ]
      },
      {
        "title": "AI for Research, Vaccines, and Medicines",
        "points": [
          "How AI can help researchers analyse scientific information and support parts of drug, vaccine, and medical-countermeasure development.",
          "Keep this conceptual and beginner-friendly rather than technically molecular."
        ]
      },
      {
        "title": "AI for Animal Health and One Health Surveillance",
        "points": [
          "How AI can support earlier detection and management of livestock and zoonotic disease, connecting animal, human, and environmental health.",
          "Why this matters given Africa's reliance on livestock economies and the animal–human interface as a common source of emerging disease threats."
        ]
      },
      {
        "title": "What Makes These Benefits Actually Work in Africa?",
        "points": [
          "Consider data quality, infrastructure, trained people, affordability, maintenance, local relevance, and institutional capacity.",
          "Ask when AI genuinely strengthens an existing system rather than simply adding new technology.",
          "AI strengthens biosecurity when it helps existing systems detect threats earlier, understand them better, or respond more effectively."
        ]
      }
    ],
    "discussionFormat": {
      "note": "This module should be more participant-led than Modules 1 and 2. Before the session, participants should choose one of the six discussion areas and watch or read the resource assigned to that topic. If the cohort is large enough, participants should be placed into breakout rooms according to the topic they selected. If the cohort is smaller, each participant can discuss the area they selected individually. Participants should focus on two questions: The facilitator should introduce the module briefly, then guide, clarify, and connect the discussion rather than lecture through all six areas.",
      "instructions": [
        "How could AI strengthen biosecurity in this area?",
        "What would need to be in place for this to work well in an African context?"
      ]
    },
    "topicResources": [
      {
        "topic": "Topic 1 — AI for Early Warning and Disease Surveillance",
        "label": "Video",
        "title": "Video: A Virus Detection Network to Stop the Next Pandemic — Pardis Sabeti & Christian Happi, TED",
        "url": "https://www.youtube.com/watch?v=moLzH50AVMk",
        "purpose": "introduce an African-led example of early-warning systems, rapid diagnostics, genomic surveillance, and real-time disease detection.",
        "note": "",
        "core": true
      },
      {
        "topic": "Topic 2 — AI for Testing and Diagnostics",
        "label": "Video",
        "title": "Video: Uganda's First AI Lab Launches a Malaria Detecting Smartphone App — CNN / Makerere AI Health Lab",
        "url": "https://www.youtube.com/watch?v=11asQYesNjY",
        "purpose": "show how an African research team used AI and smartphone technology to support faster disease diagnosis.",
        "note": "",
        "core": true
      },
      {
        "topic": "Topic 3 — AI for Pandemic Preparedness and Response",
        "label": "Video",
        "title": "Video: Outbreak Science — 60 Minutes / CBS News",
        "url": "https://www.youtube.com/watch?v=Ir-XJ62wO88",
        "purpose": "show how AI and large-scale data analysis can support early outbreak detection, forecasting, and public-health decision-making.",
        "note": "this example is not Africa-specific. The facilitator should explicitly bring the discussion back to how similar capabilities could work differently in African health systems.",
        "core": true
      },
      {
        "topic": "Topic 4 — AI for Research, Vaccines, and Medicines",
        "label": "Video",
        "title": "Video: How AI Is Helping Researchers Develop Antibiotics to Fight Drug-Resistant Infections — PBS NewsHour",
        "url": "https://www.youtube.com/watch?v=XIbIu8cWSgw",
        "purpose": "give participants a beginner-friendly example of AI being used to accelerate biomedical research and identify promising medicines.",
        "note": "this example is not Africa-specific. Participants should be encouraged to think about what access, infrastructure, research capacity, and local disease priorities would mean for applying similar approaches in Africa.",
        "core": true
      },
      {
        "topic": "Topic 5 — AI for Animal Health and One Health Surveillance",
        "label": "Article",
        "title": "Article: Nigeria to Deploy AI Tools to Tackle Livestock Disease to Improve Dairy Production — Dairy Business Middle East & Africa, 14 July 2025",
        "url": "https://dairybusinessmea.com/2025/07/14/nigeria-to-deploy-ai-tools-to-tackle-livestock-disease-to-improve-dairy-production/",
        "purpose": "show a real Nigerian example (VetWiz 2.0) of an AI platform helping field officers detect livestock disease and feeding data back to the National Veterinary Research Institute, extending the course's examples from human health into animal health and One Health.",
        "note": "",
        "core": true
      },
      {
        "topic": "Topic 6 — What Makes AI Actually Work in African Health Systems?",
        "label": "Video",
        "title": "Video: Medical Tech Designed to Meet Africa's Needs — Soyapi Mumba, TED",
        "url": "https://www.youtube.com/watch?v=6oLsJUH1cfU",
        "purpose": "show how infrastructure realities such as unreliable power, connectivity, staffing, and local needs affect whether digital health technologies can succeed in African settings.",
        "note": "",
        "core": true
      }
    ],
    "preSessionPrep": [
      "Choose one of the six Module 3 topics before the session. Watch or read the resource for that topic and come prepared to explain one way AI could strengthen biosecurity in that area, and one condition that would need to be in place for it to work well in an African context."
    ],
    "preSessionPrepNote": "Participants should receive the following instruction:",
    "facilitatorNotes": [
      "Give a short introduction to the module and explain the six discussion areas.",
      "Participants should already have chosen one area and engaged with the relevant resource before the session.",
      "If the group is large enough, place participants into breakout rooms by topic; if not, let each participant discuss the area they selected.",
      "Keep the discussion focused on how AI could strengthen biosecurity and what conditions are required for that benefit to work in Africa.",
      "Bring everyone back together and connect the different areas, highlighting where the benefits overlap and where implementation conditions differ.",
      "Keep the session participant-led. The facilitator should guide, clarify, correct misunderstandings, and connect ideas rather than lecture."
    ],
    "moduleLearningFlow": "Choose a capability area → understand how AI could strengthen it → identify what conditions Africa would need → carry the same six areas into Module 4, where each is examined from the risk side."
  },
  {
    "id": 4,
    "slug": "module-4",
    "title": "How Could the Same AI Capabilities Create New Biosecurity Risks?",
    "tagline": "Examine how the same AI capabilities can fail, be misused, or create new biosecurity vulnerabilities.",
    "overview": "This module looks at the same capability areas from Module 3, but from the risk side. The aim is to help participants understand that useful AI systems can also fail, be misused, or create new vulnerabilities. The central idea is dual use: the same capability can create both benefit and risk depending on how it is used, who has access to it, and what safeguards are in place.",
    "discussionBlocks": [
      {
        "title": "Early Warning and Disease Surveillance — What Could Go Wrong?",
        "points": [
          "False alarms, missed outbreaks, poor-quality data, privacy concerns, and unequal surveillance coverage.",
          "Overreliance on automated alerts or systems that do not reflect local realities."
        ]
      },
      {
        "title": "Testing and Diagnostics — What Could Go Wrong?",
        "points": [
          "Incorrect or biased results, especially when tools are not tested on relevant populations or settings.",
          "Health workers or institutions placing too much trust in AI outputs."
        ]
      },
      {
        "title": "Pandemic Preparedness and Response — What Could Go Wrong?",
        "points": [
          "Poor forecasts or models leading to poor decisions during emergencies.",
          "Dependence on external platforms, cybersecurity weaknesses, or systems that fail when they are most needed."
        ]
      },
      {
        "title": "Research, Vaccines, and Medicines — What Could Go Wrong?",
        "points": [
          "AI can accelerate biological research, but faster capability can also increase the consequences of mistakes or unsafe work.",
          "Some AI systems may make biological knowledge or capabilities easier to access in ways that could enable deliberate misuse."
        ]
      },
      {
        "title": "Animal Health and One Health Surveillance — What Could Go Wrong?",
        "points": [
          "Livestock AI tools trained on limited or non-representative animal populations could misdiagnose disease or delay outbreak response.",
          "Weak links between animal-health data systems and human-health surveillance systems could mean early signs of zoonotic spillover go unconnected rather than flagged."
        ]
      },
      {
        "title": "AI in African Biosecurity Systems — What New Vulnerabilities Could Appear?",
        "points": [
          "Weak infrastructure, limited oversight, poor or unrepresentative data, and dependence on technologies developed elsewhere.",
          "Data sovereignty, cybersecurity, affordability, local expertise, and who controls critical AI systems.",
          "Key Idea: The same AI capability can strengthen biosecurity and create risk. What changes is how it is used, who has access to it, where it is deployed, and what safeguards surround it."
        ]
      }
    ],
    "keyIdea": "The same AI capability can strengthen biosecurity and create risk. What changes is how it is used, who has access to it, where it is deployed, and what safeguards surround it.",
    "discussionFormat": {
      "note": "This module deliberately mirrors Module 3. Before the session, participants should choose one of the six risk areas. They may: If the cohort is large enough, group participants into breakout rooms by topic. If the cohort is smaller, allow participants to discuss their chosen area individually. Guide the discussion around three questions:",
      "instructions": [
        "continue with the same area they explored in Module 3 so they can compare benefits and risks directly; or",
        "switch to another area if they want to explore a different biosecurity concern.",
        "What useful AI capability are we talking about?",
        "How could that capability also create a biosecurity risk?",
        "Why might that risk look different in an African context?"
      ]
    },
    "resources": [
      {
        "type": "read",
        "label": "Read",
        "title": "Article: Statement on Biosecurity Risks at the Convergence of AI and the Life Sciences — NTI, 2025",
        "url": "https://www.nti.org/analysis/articles/statement-on-biosecurity-risks-at-the-convergence-of-ai-and-the-life-sciences/",
        "purpose": "introduce the central dual-use problem by showing how advances in AI and the life sciences can create major benefits while also increasing accidental or deliberate biological risks.",
        "note": "",
        "core": true
      },
      {
        "type": "read",
        "label": "Read",
        "title": "Article: The Convergence of Artificial Intelligence and the Life Sciences — NTI",
        "url": "https://www.nti.org/analysis/articles/the-convergence-of-artificial-intelligence-and-the-life-sciences/",
        "purpose": "give participants a deeper understanding of how increasingly capable AI systems may change biological research and why those changes create new biosecurity questions.",
        "note": "",
        "core": true
      },
      {
        "type": "read",
        "label": "Read",
        "title": "Report: International Scientific Report on the Safety of Advanced AI — Biological Misuse section",
        "url": "https://www.gov.uk/government/publications/international-scientific-report-on-the-safety-of-advanced-ai/international-scientific-report-on-the-safety-of-advanced-ai-interim-report",
        "purpose": "provide a more evidence-heavy discussion of what is currently known, and still uncertain, about advanced AI and biological misuse.",
        "note": "",
        "core": false
      }
    ],
    "preSessionPrep": [
      "Choose one of the six Module 4 risk areas. Come prepared to explain one way a useful AI capability in that area could also create a biosecurity risk, and why that risk matters."
    ],
    "preSessionPrepNote": "Participants should receive the following prompt:",
    "facilitatorNotes": [
      "Remind participants that Module 4 deliberately mirrors Module 3.",
      "Encourage participants to stay with their Module 3 topic if they want to examine one capability from both sides, but allow them to switch.",
      "Keep returning to the idea of dual use, rather than dividing technologies into simply \"good\" or \"bad.\"",
      "Distinguish evidence-backed risks from highly speculative claims and avoid sensational framing.",
      "Bring the conversation back to African contexts, including data, infrastructure, oversight, cybersecurity, dependence on external systems, and local capacity.",
      "Do not spend too much time solving the risks yet. Safeguards and governance belong in Module 5."
    ],
    "moduleLearningFlow": "Revisit a useful capability → identify what could go wrong → understand dual use → examine the African context → carry the identified risks into Module 5."
  },
  {
    "id": 5,
    "slug": "module-5",
    "title": "How Do We Reduce and Govern These Risks?",
    "tagline": "Connect identified risks to practical safeguards, responsible actors, and governance in African contexts.",
    "overview": "This module helps participants understand how AI-biosecurity risks can be reduced through safeguards, responsible practices, and governance. It introduces the idea that managing these risks requires action from different actors, including researchers, institutions, technology companies, governments, and regional and international bodies. The module also asks what effective governance should look like in African contexts.",
    "discussionBlocks": [
      {
        "title": "What AI-Biosecurity Risks Are Most Important in African Contexts?",
        "points": [
          "Revisit the kinds of risks identified in Module 4, including unreliable systems, weak oversight, cybersecurity problems, sensitive data, and dependence on external technologies.",
          "Ask which of these risks may be especially important because of differences in infrastructure, institutions, research capacity, health systems, and resources across African countries."
        ]
      },
      {
        "title": "What Safeguards Could Reduce These Risks in Africa?",
        "points": [
          "Introduce safeguards such as testing, monitoring, human oversight, access controls, cybersecurity, and responsible research practices.",
          "Ask which safeguards are realistic and effective in different African settings rather than assuming the same approach will work everywhere."
        ]
      },
      {
        "title": "Who Should Be Responsible for Managing These Risks?",
        "points": [
          "Consider the roles of African researchers, universities, laboratories, health institutions, technology companies, funders, governments, and regional bodies.",
          "Explore how responsibility should be shared when technologies are developed outside Africa but deployed in African health, research, or biosecurity systems."
        ]
      },
      {
        "title": "How Should AI-Biosecurity Be Governed Across Africa?",
        "points": [
          "Introduce governance as the rules, responsibilities, oversight, and accountability that shape how AI and biological capabilities are developed and used.",
          "Consider what should happen at institutional, national, regional, and international levels, and where African coordination may be especially important."
        ]
      },
      {
        "title": "How Can Africa Shape AI-Biosecurity Governance Rather Than Only Respond to It?",
        "points": [
          "Ask how African institutions and experts can participate in setting standards, developing safeguards, governing data, evaluating technologies, and shaping international decisions.",
          "Consider what capabilities, institutions, research, and cooperation would be needed for African countries to have greater influence over how AI-biosecurity is governed."
        ]
      }
    ],
    "caseStudy": {
      "title": "Africa CDC's New Five-Year Plan for Biosafety and Biosecurity",
      "purpose": [],
      "discussion": "The Africa CDC strategy provides a real African governance context for discussing how emerging technologies, including AI, synthetic biology, and digital biosurveillance, should be used safely and responsibly. The discussion should connect a specific risk from Module 4 to a practical safeguard and the actor responsible for putting that safeguard in place.",
      "resource": {
        "label": "Article: Africa CDC — Africa's New Five-Year Plan for Biosafety and Biosecurity",
        "url": "https://africacdc.org/news-item/africas-new-five-year-plan-for-biosafety-and-biosecurity/"
      },
      "prepPrompts": [
        {
          "title": "1. One way AI could go wrong here.",
          "detail": "Pick one risk from Module 4 — for example unreliable systems, weak oversight, cybersecurity problems, data misuse, or dependence on outside technologies — and place it in a realistic setting such as outbreak tracking, laboratory or surveillance analysis, biological sample screening, or research-risk assessment. Be ready to explain what could go wrong, concretely."
        },
        {
          "title": "2. One thing that could reduce the risk — and whose job it should be.",
          "detail": "Identify one practical safeguard that could reduce the risk, then identify who should be responsible for putting it in place: a laboratory, university or research institution, health institution, technology company, regulator, government, Africa CDC, funder, or several actors working together."
        }
      ]
    },
    "resources": [
      {
        "type": "read",
        "label": "Read",
        "title": "Article: Nature Africa — What AI can do for improving health in Africa",
        "url": "https://www.nature.com/articles/d44148-025-00371-3",
        "purpose": "help participants connect AI's potential benefits in African health systems with the governance questions raised in Module 5, particularly what safeguards, oversight, local capacity, and institutional responsibility are needed for these tools to work safely and effectively.",
        "note": "",
        "core": true
      }
    ],
    "facilitatorNotes": [
      "Begin by briefly reminding participants that Module 4 focused on identifying risks; Module 5 is about what can be done about them.",
      "Use the Africa CDC five-year biosafety and biosecurity plan to ground the discussion in a real African governance effort.",
      "Keep asking participants to connect each proposed safeguard to a specific risk, rather than discussing governance in the abstract.",
      "Push participants to identify who is responsible for each safeguard: researchers, laboratories, institutions, governments, regulators, funders, technology companies, Africa CDC, or several actors together.",
      "Bring the discussion back to African realities such as institutional capacity, infrastructure, cybersecurity, data governance, local expertise, funding, and dependence on technologies developed elsewhere.",
      "Encourage participants to notice that the same safeguard may work differently across countries and institutions.",
      "Avoid turning the session into a detailed lecture on laws, regulations, or governance frameworks.",
      "Emphasise that governance is not only about restricting technology; it is also about creating the conditions for useful technologies to be used safely and responsibly.",
      "End by asking what important gaps remain unresolved. These should naturally lead into Module 6 — What Should Africa Do Next on AI and Biosecurity?"
    ],
    "moduleLearningFlow": "Revisit the risks from Module 4 → identify practical safeguards → decide who is responsible → examine whether those safeguards work in African contexts → identify remaining governance gaps → carry those gaps into Module 6."
  },
  {
    "id": 6,
    "slug": "module-6",
    "title": "What Should Africa Do Next on AI and Biosecurity?",
    "tagline": "Bring the course together around African priorities, capability gaps, governance, and research questions.",
    "overview": "This module brings together the main ideas from the course and asks what they mean for Africa in practice. By the end, participants should be able to identify important priorities for AI and biosecurity in African contexts, recognize key capability and governance gaps, and begin thinking about practical actions and research questions for the future.",
    "discussionBlocks": [
      {
        "title": "What Should Africa Prioritize?",
        "points": [
          "Which AI and biosecurity issues or capabilities deserve the most attention in African contexts?",
          "Why might priorities differ across countries, sectors, and areas such as public health, agriculture, animal health, research, and preparedness?"
        ]
      },
      {
        "title": "What Capabilities Need to Be Built?",
        "points": [
          "What people, institutions, infrastructure, data, laboratories, and technical expertise are needed to use AI safely and effectively for biosecurity?",
          "Where are the most important capacity gaps, and which of them can realistically be addressed?"
        ]
      },
      {
        "title": "Where Is Africa Dependent on Others?",
        "points": [
          "Where do African countries depend on external technologies, data, funding, infrastructure, expertise, or biological products?",
          "When is international dependence useful, and when might it create vulnerabilities for preparedness, access, or decision-making?"
        ]
      },
      {
        "title": "Who Needs to Act?",
        "points": [
          "What responsibilities belong to researchers, universities, laboratories, governments, technology companies, Africa CDC, the African Union, funders, and international organizations?",
          "Which problems require action at institutional, national, regional, continental, or international levels?"
        ]
      },
      {
        "title": "What Should Africa Research Next?",
        "points": [
          "What important questions about AI and biosecurity in Africa still lack good evidence?",
          "How can participants turn the problems and gaps identified throughout the course into useful research questions?"
        ]
      }
    ],
    "caseStudy": {
      "title": "Case Study / Core Reading",
      "purpose": [],
      "discussion": "African Union Peace and Security Council — 1339th Meeting, \"Artificial Intelligence: Governance, Peace and Security\" 16 April 2026, Addis Ababa",
      "resource": {
        "label": "View source",
        "url": "https://www.peaceau.org/en/article/communique-of-the-1339th-meeting-of-the-psc-on-artificial-intelligence-governance-peace-and-security-held-on-thursday-16-april-2026"
      }
    },
    "resources": [
      {
        "type": "read",
        "label": "Read",
        "title": "Research ICT Africa — \"African perspectives are missing from AI safety\"",
        "url": "https://researchictafrica.net/2025/09/17/african-perspectives-are-missing-from-ai-safety/",
        "purpose": "ground the pre-session exercise in a discussion of Africa's participation, capacity, and evidence gaps in AI safety.",
        "note": "",
        "core": true
      }
    ],
    "preSessionPrep": [
      "One priority: based on the course, choose one AI-biosecurity issue you would put at the top of Africa's list right now and explain why it should come before the others.",
      "One gap: choose either weak technical capacity or weak participation in global AI safety conversations and name one concrete thing that is missing — people, institutions, funding, or seats at the table.",
      "One open question: write one research question the course has left you curious about — something on AI and biosecurity in Africa that still lacks good evidence.",
      "Optional: if only a minority of African states are actively engaging on AI safety, is that mainly a resourcing problem, a priority problem, or something else?"
    ],
    "preSessionPrepNote": "Participants should complete this exercise after reading the supporting article and before the live session.",
    "facilitatorNotes": [
      "Open by asking participants what they think Africa should prioritize on AI and biosecurity before introducing the discussion blocks.",
      "Use the five core blocks to guide the conversation rather than lecture through them.",
      "Bring in the African Union Peace and Security Council case after participants have begun identifying priorities, gaps, and responsibilities.",
      "Use the pre-session exercise to start from participants' own choices: one priority, one gap, and one open research question.",
      "Encourage participants to explain why they chose a priority, not just name one.",
      "Keep bringing the discussion back to African contexts, including differences between countries, institutions, sectors, and levels of capacity.",
      "Avoid pushing the group toward one \"correct\" continental priority; the aim is to compare reasoning, trade-offs, and different perspectives.",
      "Keep the discussion practical and research-oriented rather than turning it into a broad debate about AI policy in general.",
      "Remind participants that Module 6 leads directly into the final project: a short 3–5 hour applied project based on the research question they developed in this module.",
      "Course completion requires participation in at least 4 of the 6 live sessions, completion of the pre-session exercise for each attended module, and submission of the final project."
    ],
    "moduleLearningFlow": "Bring together priorities, capabilities, dependencies, responsibility, and research gaps → apply them in a short final project → complete the course → continue into AIxBio Africa's community, fellowship, and research pathway."
  }
];
