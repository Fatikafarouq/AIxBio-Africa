import { useState, useEffect, useCallback } from "react";
import { supabase } from "./lib/supabase";
import CourseShell from "./course/CourseShell";
import CourseAuth from "./course/CourseAuth";
import markAiken from "./assets/mark-aiken.png";
import gowthaamGokulakrishnan from "./assets/gowthaam-gokulakrishnan.jpeg";
import jeanneVincendeau from "./assets/jeanne-vincendeau.jpeg";
import francesAgba from "./assets/frances.jpeg";
import teganJegede from "./assets/tegan.jpeg";
import gideonAbako from "./assets/gideon-abako.jpeg";
/* ══════════════════════════════════════════════════════
   AIxbio Africa · Institutional Website
   Founder: Fatika Umar Ibrahim
   ══════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Figtree:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{background:#F7F6F2;color:#1A1917;font-family:'Figtree',system-ui,sans-serif;}
::selection{background:#B8102A;color:#fff;}
:root{
  --bg:#F7F6F2;--wht:#ffffff;--blk:#1A1917;--sec:#5A5956;--red:#B8102A;--rdk:#8A0D20;
  --brd:#E5E3DE;--brd2:#CECCCA;--navh:68px;
}
.reveal{opacity:0;transform:translateY(16px);transition:opacity .6s cubic-bezier(.4,0,.2,1),transform .6s cubic-bezier(.4,0,.2,1);}
.reveal.in{opacity:1;transform:translateY(0);}
.d1{transition-delay:.07s;}.d2{transition-delay:.14s;}.d3{transition-delay:.21s;}.d4{transition-delay:.28s;}.d5{transition-delay:.35s;}
@keyframes fin{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
@keyframes aflt{0%,100%{transform:translateY(0);}50%{transform:translateY(-9px);}}
.ha{animation:fin .9s cubic-bezier(.4,0,.2,1) .2s both;}
.hb{animation:fin .9s cubic-bezier(.4,0,.2,1) .42s both;}
.hc{animation:fin .9s cubic-bezier(.4,0,.2,1) .6s both;}
.hd{animation:fin .9s cubic-bezier(.4,0,.2,1) .76s both;}
.aflt{animation:aflt 11s ease-in-out infinite;}
.lft{transition:transform .26s cubic-bezier(.4,0,.2,1),box-shadow .26s,border-color .26s;}
.lft:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,.07);border-color:#B8102A!important;}
.nb{background:none;border:none;cursor:pointer;font-family:'Figtree',sans-serif;font-size:13px;font-weight:500;letter-spacing:.01em;padding:4px 0;transition:color .17s;white-space:nowrap;}
.nbr{background:#B8102A;color:#fff;border:none;font-family:'Figtree',sans-serif;font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;padding:9px 20px;cursor:pointer;transition:background .2s;border-radius:0;}
.nbr:hover{background:#8A0D20;}
.tag{display:inline-block;font-family:'Figtree',sans-serif;font-size:9.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:3px 8px;border-radius:2px;}
.tr{background:rgba(184,16,42,.09);color:#B8102A;}.tg{background:rgba(26,118,70,.09);color:#1A7646;}.tb{background:rgba(43,87,164,.09);color:#2B57A4;}.ta{background:rgba(152,104,18,.09);color:#986812;}.tl{background:rgba(80,76,72,.09);color:#504C48;}
.pat-lt{background-image:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='%23B8102A' fill-opacity='.03'/%3E%3C/svg%3E");}
.pat-dk{background-image:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='%23B8102A' fill-opacity='.055'/%3E%3C/svg%3E");}
input,textarea,select{font-family:'Figtree',sans-serif;font-size:14px;color:#1A1917;background:#fff;border:1px solid var(--brd);padding:11px 14px;width:100%;outline:none;transition:border-color .2s;border-radius:0;-webkit-appearance:none;appearance:none;}
input:focus,textarea:focus,select:focus{border-color:#B8102A;}
input::placeholder,textarea::placeholder{color:#9A9896;}
textarea{resize:vertical;min-height:100px;}
.br{background:#B8102A;color:#fff;border:none;font-family:'Figtree',sans-serif;font-size:12.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;padding:12px 24px;transition:background .2s,transform .14s;border-radius:0;}
.br:hover{background:#8A0D20;transform:translateY(-1px);}
.br:disabled{background:#b0aeab;cursor:not-allowed;transform:none;}
.bo{background:transparent;color:#B8102A;border:1.5px solid #B8102A;font-family:'Figtree',sans-serif;font-size:12.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;padding:11px 22px;transition:background .2s,color .2s;border-radius:0;}
.bo:hover{background:#B8102A;color:#fff;}
.bg{background:transparent;color:rgba(255,255,255,.88);border:1px solid rgba(255,255,255,.28);font-family:'Figtree',sans-serif;font-size:12.5px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;cursor:pointer;padding:11px 22px;transition:border-color .2s,background .2s;border-radius:0;}
.bg:hover{border-color:rgba(255,255,255,.68);background:rgba(255,255,255,.07);}
.bn{background:transparent;border:none;font-family:'Figtree',sans-serif;cursor:pointer;padding:0;}
table{width:100%;border-collapse:collapse;}
th{font-family:'Figtree',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--sec);padding:9px 14px;text-align:left;border-bottom:1px solid var(--brd);}
td{font-family:'Figtree',sans-serif;font-size:13.5px;padding:11px 14px;border-bottom:1px solid var(--brd);vertical-align:top;color:#2E2C2A;}
.chip{display:inline-block;font-family:'Figtree',sans-serif;font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;padding:2px 8px;border-radius:2px;}
.cp{background:rgba(43,87,164,.1);color:#2B57A4;}.cg{background:rgba(26,118,70,.1);color:#1A7646;}
.err{color:#B8102A;font-family:'Figtree',sans-serif;font-size:11.5px;margin-top:4px;}
.tab-b{background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:'Figtree',sans-serif;font-size:13px;font-weight:500;color:var(--sec);padding:10px 16px 10px;white-space:nowrap;transition:color .18s,border-color .18s;}
.tab-b.on{color:#B8102A;border-bottom-color:#B8102A;font-weight:600;}
.tab-b:hover:not(.on){color:var(--blk);}
.dd{position:absolute;top:calc(100% + 6px);right:0;background:#fff;border:1px solid var(--brd);box-shadow:0 6px 24px rgba(0,0,0,.09);min-width:172px;z-index:400;padding:5px 0;}
.dd button{display:block;width:100%;text-align:left;padding:9px 18px;font-family:'Figtree',sans-serif;font-size:13.5px;color:var(--blk);background:none;border:none;cursor:pointer;transition:background .13s,color .13s;}
.dd button:hover{background:var(--bg);color:#B8102A;}
.faq-item{border-bottom:1px solid var(--brd);padding:18px 0;}
.faq-item:first-child{border-top:1px solid var(--brd);}
.step-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Figtree',sans-serif;font-size:12px;font-weight:600;flex-shrink:0;line-height:1;}
.fellow-card{border:1px solid var(--brd);background:#fff;transition:border-color .2s,box-shadow .2s,transform .2s;}
.fellow-card:hover{border-color:var(--brd2);box-shadow:0 8px 24px rgba(0,0,0,.045);}
.fellow-disclosure:focus-visible{outline:2px solid #B8102A;outline-offset:3px;}
.fellow-link:focus-visible{outline:2px solid #B8102A;outline-offset:2px;}
.fellow-details{animation:fin .28s cubic-bezier(.4,0,.2,1) both;}
.fellow-tags{display:flex;gap:6px;flex-wrap:wrap;}
@media(max-width:1100px){.nl{display:none!important;}.mob-btn{display:flex!important;}}
@media(max-width:900px){.g2,.g2r{grid-template-columns:1fr!important;}.g3{grid-template-columns:1fr 1fr!important;}.rg{grid-template-columns:1fr 1fr!important;}.fg{grid-template-columns:1fr 1fr!important;}.sg{grid-template-columns:1fr 1fr!important;}.mg{grid-template-columns:1fr 1fr!important;}}
@media(max-width:580px){.g3,.rg,.fg{grid-template-columns:1fr!important;}.mg{grid-template-columns:1fr!important;}.sg{grid-template-columns:1fr 1fr!important;}}
@media(max-width:480px){.hero-pad{padding:96px 24px 64px!important;}.sec-pad{padding:64px 24px!important;}.page-hdr-pad{padding:108px 24px 48px!important;}}
`;

/* ══════════ DATA ══════════════════════════════════════ */

const RESEARCH = [
  {id:"01",slug:"ai-biosec-eval",tag:"Core",tc:"tr",title:"AI Biosecurity Evaluation",
   short:"Systematic red-teaming of frontier AI models to assess safety guardrail consistency across African linguistic and cultural framings.",
   body:`We test whether AI safety systems behave consistently when biosecurity-sensitive information is expressed in languages and framings that differ from standard English clinical terminology. Our initial work examined African ethnoveterinary language — comparing model behavior when the same biological agent was described using indigenous terminology versus standard clinical language.\n\nThe pattern we observed reflects a training data gap. Safety guardrails trained predominantly on English-language text show significant behavioral inconsistency when the same concept appears in African indigenous terminology. This is not a jailbreak exploit; it is a systematic gap in training data coverage with practical consequences for how AI tools perform in African biosecurity settings.\n\nWe are developing a replicable evaluation methodology for testing AI safety consistency across linguistic and cultural contexts, beginning with African language biosecurity domains. A full methods paper is in preparation.`},
  {id:"02",slug:"pandemic-prep",tag:"Research",tc:"tb",title:"Pandemic Preparedness",
   short:"Studying AI-assisted outbreak detection and response frameworks in African public health contexts.",
   body:`Pandemic preparedness in Africa is shaped by infrastructure constraints, data scarcity, and systematic underrepresentation in global modeling efforts. We examine where AI tools can be applied responsibly in these settings and where current systems fall short.\n\nThis research track reviews existing early warning systems, assesses their performance in African settings, and identifies where AI-assisted approaches could most usefully improve surveillance and response. We work in collaboration with researchers in public health, epidemiology, and AI safety.`},
  {id:"03",slug:"capacity",tag:"Programme",tc:"tg",title:"Scientific Capacity Building",
   short:"Designing training and mentorship structures for African researchers entering biosecurity science.",
   body:`Very few African scientists currently work in global biosecurity research. This reflects structural constraints — training infrastructure, mentorship networks, and funding pathways are sparse, and most existing biosecurity programmes are oriented toward institutional contexts outside Africa.\n\nAIxbio Africa is developing a 5-week fellowship programme, targeted workshops, and a peer network for African researchers in biosecurity, pandemic science, and AI safety. The first fellowship cohort is planned for 2026.`},
  {id:"04",slug:"agri-biosec",tag:"Research",tc:"tb",title:"Agricultural Biosecurity",
   short:"Examining transboundary animal disease risks and zoonotic spillover in African livestock systems.",
   body:`Africa's livestock systems are major zoonotic spillover interfaces. Foot-and-mouth disease, Rift Valley fever, anthrax, brucellosis, and Newcastle disease all circulate in African animal populations with varying surveillance and containment. We study how biosecurity risks in agricultural settings are documented, communicated, and managed — and where AI-assisted approaches might improve surveillance.`},
  {id:"05",slug:"ai-lifesci",tag:"Research",tc:"tb",title:"AI Safety in Life Sciences",
   short:"Examining how large language models handle biologically sensitive information across framing conditions.",
   body:`As AI systems become more capable in life science domains, understanding how they handle dual-use biological information becomes more consequential. We study boundary conditions of AI safety in this space — when guardrails work, when they fail, and what determines the difference. Our approach uses systematic test cases across multiple framing conditions, languages, and specificity levels, scored manually against a biosecurity rubric.`},
  {id:"06",slug:"policy",tag:"Policy",tc:"ta",title:"Biosecurity Policy Analysis",
   short:"Translating research findings into policy-relevant recommendations for African governments and international bodies.",
   body:`Biosecurity policy in Africa operates across national governments, the Africa CDC, regional bodies, and international frameworks including the Biological Weapons Convention and Global Health Security Agenda. We track how AI developments intersect with these frameworks and contribute analysis where relevant. Our policy work is grounded in our research — we do not produce policy documents independently of the science.`},
];

const BLOG = [
  {slug:"guardrails-african-language",cat:"AI Safety",tc:"tr",date:"May 2026",rt:"8 min",
   title:"AI Safety Guardrails and African Language Contexts",
   excerpt:"We tested whether frontier AI models maintain consistent safety behavior when biosecurity-sensitive information is expressed in African indigenous terminology. The results point to a training data gap.",
   body:`Most AI safety systems are trained primarily on English-language data. When biosecurity-relevant information appears in another language — particularly one underrepresented in training data — the safety system may not recognize it as relevant.\n\nWe examined this using African ethnoveterinary language: terminology used in Africa to describe animal diseases, some of which correspond to listed biological threat agents.\n\nOur pilot study found that the same biological agent generated different AI responses depending on terminology. Standard English clinical language produced refusals and safety warnings at expected rates. African indigenous terminology for the same agent produced different, more hazardous patterns.\n\nThis is not a novel attack on AI safety systems. It is a reflection of training data composition. The practical implication: AI biosecurity tools used in African settings may behave differently from how they were evaluated. We are continuing this work with a larger set of disease agents and language contexts. A full paper is in preparation.`},
  {slug:"risk-and-capacity",cat:"Policy",tc:"ta",date:"Apr 2026",rt:"6 min",
   title:"Biological Risk and Scientific Capacity in Africa",
   excerpt:"Africa carries a disproportionate share of global zoonotic spillover risk. Scientific capacity to study and respond to that risk is not proportionally distributed.",
   body:`The relationship between biological risk and scientific capacity in Africa is well documented but rarely addressed structurally. Africa accounts for a significant fraction of globally emerging infectious disease events, hosts the most consequential wildlife-livestock-human interfaces, and carries the highest burdens of several endemic zoonotic diseases.\n\nAfrica-based biosecurity research, particularly in pandemic modeling, AI safety, and dual-use research governance, is thin. This is not simply a resource problem, though resources matter. The training pathways, mentorship networks, and publishing venues that connect young scientists to biosecurity research are mostly located outside Africa.\n\nAIxbio Africa was founded partly to work on this problem directly. We can contribute specific things: credible research, a fellowship that is genuinely useful to early-career African scientists, and a visible presence at the intersection of AI and biosecurity.`},
  {slug:"curriculum-design",cat:"Capacity Building",tc:"tg",date:"Mar 2026",rt:"10 min",
   title:"Designing Biosecurity Training for African Research Contexts",
   excerpt:"What should a biosecurity training programme for African researchers include? We are thinking carefully about this as we design our 2026 fellowship.",
   body:`Designing a biosecurity training programme is harder than it looks. The technical content is relatively clear: dual-use research governance, pandemic preparedness, AI safety concepts, biosurveillance methods. What is harder is framing the programme correctly for researchers working in African contexts.\n\nExisting biosecurity programmes are often excellent but implicitly oriented toward US or European institutional settings. Funding structures, regulatory frameworks, career pathways — these do not translate directly to African settings.\n\nFor our fellowship, we work from several design principles. Scientific content should be genuinely rigorous — not a simplified version of what is taught elsewhere. Local context should be foregrounded: biological risk in Africa has specific characteristics that should shape the curriculum. The programme should connect participants to the global biosecurity community, not only to each other.\n\nWe are still designing this. If you have experience running research training programmes and want to contribute, we would like to hear from you.`},
  {slug:"methodology",cat:"Methodology",tc:"tb",date:"Feb 2026",rt:"7 min",
   title:"Red-Teaming AI Systems for Biosecurity: Our Approach",
   excerpt:"How we test AI safety systems in biosecurity contexts, and why consistent methodology matters for the validity of findings.",
   body:`Red-teaming AI systems for biosecurity requires a specific and defensible methodology. You need to test consistently, score consistently, and interpret results in a way that is useful to researchers and AI developers.\n\nOur approach draws on the Frontier Model Forum's biological threat taxonomy, which provides a structured way of thinking about stages at which AI systems might contribute to biological harm. We test across multiple framing conditions — naive user, domain expert, operational actor — and across multiple levels of specificity.\n\nScoring is done against a rubric that distinguishes between refusals, partial responses, and full responses, and separately assesses hazardous information content. One methodological commitment we are firm about: we do not use AI systems to score AI systems. Self-preference bias is a real problem in LLM-as-judge approaches, and we avoid it by scoring manually against our rubric.`},
];

const MENTORS = [
  {
    name: "Mark Aiken",
    role: "Policy Mentor",
    img: markAiken,
    bio: "Mark is a lawyer and AI governance practitioner with over 20 years of experience advancing good governance, institutional reform, and public policy across Africa, Asia-Pacific, and the Middle East. His work spans governments, the United Nations, multilateral development banks, and international organisations, leading complex governance initiatives in high-risk and politically sensitive environments. His current research focuses on the governance of AI, with particular interest in decision support systems and their responsible deployment across the public and private sectors.",
  },
  {
    name: "Gowthaam Gokulakrishnan",
    role: "Technical Mentor",
    img: gowthaamGokulakrishnan,
    bio: "Gowthaam is a Senior Machine Learning Engineer at a Bulge Bracket Bank. He is passionate about building AI solutions that solve complex real-world problems. Beyond his professional work, he enjoys mentoring students and young professionals, helping them strengthen technical skills, build confidence, and navigate their career journeys with purpose. Through AIxBio Africa, Gowthaam looks forward to sharing his experiences, supporting fellows in achieving their goals, and contributing to a community that empowers the next generation of innovators and leaders.",
  },
  {
    name: "Jeanne Vincendeau",
    role: "Governance Mentor",
    img: jeanneVincendeau,
    bio: "Jeanne is an independent researcher working at the intersection of international relations, political violence, and AI governance. Her work explores power concentration, AI geopolitics, and the use of AI in diplomatic contexts, always with a focus on ensuring AI development remains inclusive and human-centered. She is the co-founder of Horizon AGI, a French nonprofit supporting AI safety by raising awareness and empowering interdisciplinary talents. Through the fellowship, Jeanne is committed to helping fellows strengthen their political impact while building confidence in navigating the technical-governance gaps of the AI safety ecosystem.",
  },
];

const FELLOWS = [
  {
    id: "frances-chinaza-agba",
    name: "Frances Chinaza Agba",
    image: francesAgba,
    role: "AI Governance, Risk and Assurance Specialist; Computer Science educator",
    affiliation: "Co-founder, LumenAfri",
    country: "UK",
    projectTitle: "Beyond Refusal — Evaluating Culturally Grounded Public-Health AI Responses Across Nigerian Languages",
    researchQuestion: "Does AI behave differently when culturally grounded Nigerian public-health scenarios are presented in Nigerian languages (Pidgin, Yoruba, Igbo) vs. standard English?",
    projectSummary: "This project evaluates two frontier AI models on matched prompts—direct versus culturally contextualised—across six Nigerian-context domains: women's health and harmful practices, mental health and stigma, traditional health practices, illness recognition, outbreaks and emergencies, and endemic diseases. Responses are assessed on safety calibration, public-health quality, and cultural calibration. The scope was narrowed from biosecurity guardrails to a focused multilingual evaluation, with calibration rather than refusal rate as the core metric. A structured prompt library connecting translations, model outputs, and coding is being developed.",
    africanContext: "TODO: Add Frances's final wording on why this research matters in the African context.",
    researchAreas: ["AI Safety", "Multilingual AI", "Public Health", "Cultural Calibration"],
    methodology: [
      "Matched-prompt testing across two frontier AI models",
      "Direct versus culturally contextualised prompt conditions",
      "Six-domain taxonomy scoring",
      "Structured prompt library linking translation, outputs, and coding"
    ],
    mentor: { name: "Jeanne Vincendeau", affiliation: "" },
    status: "In Progress",
    expectedOutput: "Research paper and a lightweight “Beyond Refusal” evaluation prototype",
    bio: "Frances is an AI Governance, Risk and Assurance Specialist and Computer Science educator. Her work focuses on responsible AI, AI governance, multilingual AI safety, and AI education, with particular interest in AI safety and equity across African contexts. She is also co-founder of LumenAfri, a nonprofit expanding digital and AI education access for underserved communities in Nigeria.",
    links: {
      linkedin: "https://www.linkedin.com/in/nazaagba",
      website: "",
      github: "",
      scholar: "",
      orcid: ""
    },
    outputs: []
  },
  {
    id: "tegan-jegede",
    name: "Tegan Jegede",
    image: teganJegede,
    role: "Empirical AI Safety Researcher",
    affiliation: "Nile University · Computer Science master's candidate",
    country: "Nigeria",
    projectTitle: "Evaluating Confidence and Policy Collapse in Multimodal Agents: Towards Robust Auditing Standards for African Healthcare",
    researchQuestion: "How reliably does a multimodal agent's confidence correspond to its correctness across healthcare domains, and how does that relationship change with degraded medical images or regionally relevant clinical questions?",
    projectSummary: "This project audits whether multimodal AI systems are appropriately uncertain on healthcare questions in African contexts, measuring calibration, abstention, and high-confidence errors rather than treating all wrong answers as hallucinations. It tests LLaVA-1.5-7B against AfriMed-QA, with SLAKE and PathVQA as imaging controls, using accuracy, Expected Calibration Error, Brier score, abstention rate, and high-confidence error rate. Robustness is also evaluated under controlled image blur and reduced illumination. The work is framed strictly as a research auditing study rather than a clinical diagnostic system.",
    africanContext: "AfriMed-QA provides the primary African healthcare context for the audit, supporting evaluation of multimodal systems against regionally relevant clinical questions and informing auditing standards for potential use in African healthcare settings.",
    researchAreas: ["Uncertainty Quantification", "Multimodal AI Safety", "Healthcare AI Auditing", "Model Calibration"],
    methodology: [
      "Benchmark LLaVA-1.5-7B using AfriMed-QA, SLAKE, and PathVQA",
      "Evaluate accuracy, ECE, Brier score, abstention rate, and high-confidence error rate",
      "Test robustness under controlled image blur and reduced illumination",
      "Estimate confidence from relative probabilities across predefined answer options"
    ],
    mentor: { name: "Jeanne Vincendeau", affiliation: "" },
    status: "In Progress",
    expectedOutput: "Reproducible audit pipeline, cross-domain failure-mode analysis, and preliminary recommendations for evaluating multimodal systems in African healthcare",
    bio: "Tegan is an empirical AI safety researcher and computer science master's candidate at Nile University, building on a foundation in electrical and electronics engineering. His research focuses on Uncertainty Quantification and Hybrid Reward Architectures to mitigate confident hallucinations in multimodal agents. During the fellowship, he is extending PyTorch multi-seed evaluation pipelines published at ICML 2026 to test open-weight models for policy collapse on dual-use biological tasks.",
    links: {
      linkedin: "https://www.linkedin.com/in/tegan-jegede-52b296197",
      website: "",
      github: "",
      scholar: "",
      orcid: ""
    },
    outputs: []
  },
  {
    id: "gideon-abako",
    name: "Gideon Abako",
    image: gideonAbako,
    role: "Founder, Public Interest Technology",
    affiliation: "Neuravox Foundation",
    country: "",
    projectTitle: "Minimum Risk Management Checks for AI Decision Support Tools in Primary and Community Health Care",
    researchQuestion: "What minimum risk management checks should health institutions apply across the deployment lifecycle of AI decision support tools used in primary and community health care?",
    projectSummary: "This project examines how health institutions can translate high-level AI governance principles into practical, minimum risk management checks for AI decision support tools used in frontline health care. Drawing on a targeted review of global governance frameworks, digital health guidance, medical-device guidance, and emerging African deployment evidence, the research develops a practitioner-facing lifecycle framework covering the selection, local validation, deployment, monitoring, and eventual withdrawal of AI decision support systems. The work focuses primarily on primary care, while treating community health as an adjacent frontline context with additional language, referral, authority, and implementation risks.",
    africanContext: "Primary and community health institutions in African settings may face distinct challenges when deploying AI decision support systems, including uneven infrastructure, language and local-context gaps, limited specialist support, variable documentation quality, data representativeness concerns, and limited institutional leverage over technology vendors. This research aims to translate broad AI governance principles into practical, context-sensitive checks that health institutions can use when deciding whether and how AI systems should influence frontline care.",
    researchAreas: ["AI Governance", "Health AI", "AI Risk Management", "Primary Health Care"],
    methodology: [
      "Targeted literature review and source matrix covering 22 core governance, health-system, regulatory, and empirical sources",
      "Evidence mapping of AI decision support risks and implementation evidence in primary and community health care",
      "Development of a risk taxonomy covering clinical safety, data, human oversight, workflow, accountability, infrastructure, privacy, vendors, monitoring, and decommissioning",
      "Development of a five-stage lifecycle framework spanning procurement, pre-deployment assessment, deployment, monitoring, and post-deployment learning"
    ],
    mentor: { name: "Mark Aiken", affiliation: "Policy Mentor" },
    status: "In Progress",
    expectedOutput: "Lifecycle risk management framework paper or practitioner report, supported by a one-page minimum risk checklist",
    bio: "Gideon Abako is Founder of Neuravox Foundation, a public interest technology organisation working across artificial intelligence, data systems, health, language infrastructure and digital governance in Africa. His work spans government, regional and funder programmes including FCDO/Elrha-funded research on AI-enabled health supply chains in Uganda, Mozilla Common Voice language data infrastructure, and a cross-country East African Community study on AI-enabled immunization stock monitoring in Uganda and Tanzania. He has also advised UK FCDO on AI and commercialization as well as innovation ecosystems in West Africa.",
    links: {
      linkedin: "https://www.linkedin.com/in/gideonluper/",
      website: "",
      github: "",
      scholar: "",
      orcid: ""
    },
    outputs: []
  },
  {
    id: "fellow-4",
    placeholder: true,
    name: "",
    image: null,
    role: "",
    affiliation: "",
    country: "",
    projectTitle: "",
    researchQuestion: "",
    projectSummary: "",
    africanContext: "",
    researchAreas: [],
    methodology: [],
    mentor: { name: "", affiliation: "" },
    status: "",
    expectedOutput: "",
    bio: "",
    links: {
      linkedin: "",
      website: "",
      github: "",
      scholar: "",
      orcid: ""
    },
    outputs: []
  }
];

const FAQS = [
  {q:"How long is the fellowship?",a:"The fellowship is a 5-week intensive remote programme. All sessions are conducted online, with a combination of scheduled seminars, mentored research time, and small group work."},
  {q:"Who is eligible to apply?",a:"Applicants from all African countries are encouraged to apply. We welcome students, recent graduates, independent researchers, and early-career professionals with an interest in AI, biosecurity, health systems, governance, or related fields. No prior biosecurity research experience is required."},
  {q:"Is there a cost to participate?",a:"The programme is offered at no cost to accepted fellows. There is no stipend for the pilot cohort."},
  {q:"What are the expected outputs?",a:"By the end of the fellowship, each fellow is expected to produce one of the following: a research report, a preprint, a conference paper submission, or a policy research paper."},
  {q:"Can I apply if I am not based in Africa?",a:"The fellowship is designed for African researchers or those working on African biosecurity and AI contexts. Applicants from outside Africa whose work is directly relevant may be considered on a case-by-case basis."},
  {q:"When is the application deadline?",a:"Fellow applications for the pilot cohort closed on 3 July 2026. Decisions will be released in July 2026 and the fellowship begins in July 2026. We are currently welcoming applications from prospective mentors for this cohort — see the Mentors tab for details."},
  {q:"What disciplines are relevant?",a:"We welcome researchers from life sciences, veterinary medicine, public health, computational biology, computer science, policy, governance, and related fields. The common thread is an interest in AI, biosecurity, and their intersection in African contexts."},
  {q:"How competitive is admission?",a:"The pilot cohort is limited to 5 fellows to ensure quality of mentorship and research support. We particularly encourage applications from researchers from underrepresented backgrounds in biosecurity and AI research."},
];

const SCHEDULE = [
  {week:"Week 1",title:"Foundations",topics:["AI safety concepts and frameworks","Introduction to biosecurity and dual-use research","Overview of biological threats and global governance","Research methods and evaluation design"]},
  {week:"Week 2",title:"African Contexts",topics:["Zoonotic risk landscapes in Africa","Linguistic and cultural specificity in biosecurity","Agricultural and wildlife biosecurity in practice","Case studies from the field"]},
  {week:"Week 3",title:"AI and Biosecurity",topics:["How AI systems handle biosecurity-relevant information","Red-teaming methodology and evaluation rubrics","Case study: AI safety guardrails and African language","Practitioner perspectives from AI labs"]},
  {week:"Week 4",title:"Policy and Communication",topics:["Translating research findings to policy audiences","Writing for policymakers and funders","African biosecurity institutions and stakeholders","Building a research agenda"]},
  {week:"Week 5",title:"Capstone and Next Steps",topics:["Research memo presentation to cohort and mentors","Peer and mentor feedback","Publishing pathways and fellowship alumni network","Career development in biosecurity research"]},
];

/* ══════════ TEAM / FOUNDING TEAM DATA ═══════════════ */

const FOUNDING_ROLES = [
  {title:"Founding Partnerships & Grants Associate",desc:"Help build strategic partnerships, recruit mentors, identify funding opportunities, and support grant development."},
  {title:"Founding Communications & LinkedIn Manager",desc:"Lead our communications strategy and help grow AIxBio Africa's online presence."},
  {title:"Founding Executive & Operations Assistant",desc:"Support the Founder in coordinating day-to-day operations and helping the organization run efficiently."},
  {title:"Founding Director of Research",desc:"Help shape and lead AIxBio Africa's research agenda, guiding methodology, quality, and rigor across our biosecurity and AI safety research areas."},
  {title:"Founding Operations Lead",desc:"Own the operational backbone of AIxBio Africa, building the systems and processes that keep the organization running smoothly as it grows."},
];

const FOUNDING_BENEFITS = [
  "Build systems and programs from the ground up.",
  "Take ownership of projects with real responsibility.",
  "Work closely with the Founder and other founding team members.",
  "Collaborate with researchers, mentors, and professionals.",
  "Develop leadership and operational experience.",
  "Help shape the culture and future direction of AIxBio Africa.",
];

const TEAM_APPLY_URL = "https://airtable.com/appkjlP1PITnNuUqa/pagMJQXa2k8jLZlQX/form";

/* ══════════ PRIMITIVES ══════════════════════════════ */

const AfricaSvg = ({ style = {} }) => (
  <svg viewBox="0 0 100 128" fill="currentColor" style={{ display:"block",...style }}>
    <path d="M50,5 C45,5 38,9 33,14 C28,19 23,26 20,34 C17,42 15,51 15,60 C15,69 17,78 21,86 C25,94 31,101 38,107 C44,112 51,115 58,114 C65,113 71,108 76,102 C82,95 85,86 86,76 C87,65 85,54 80,44 C75,34 68,25 61,17 C56,11 53,5 50,5 Z M62,14 C67,9 69,4 66,2 C64,1 62,3 62,7 Z"/>
  </svg>
);

/* light prop: use white text when rendered on a dark background */
const Logo = ({ size = 21, onClick, light = false }) => (
  <div onClick={onClick} style={{ display:"flex",alignItems:"center",gap:9,cursor:"pointer",userSelect:"none" }}>
    <AfricaSvg style={{ width:size*1.05,height:size*1.22,color:"#B8102A",flexShrink:0 }}/>
    <div style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:size,color:light?"#ffffff":"#1A1917",letterSpacing:"-0.02em",lineHeight:1 }}>
      AIxbio<span style={{ fontFamily:"'Figtree',sans-serif",fontSize:size*.43,fontWeight:400,letterSpacing:".14em",textTransform:"uppercase",color:light?"rgba(255,255,255,.5)":"rgba(26,25,23,.38)",marginLeft:size*.28 }}>Africa</span>
    </div>
  </div>
);

const Sec = ({ children, bg="#F7F6F2", style:s={}, id }) => (
  <section id={id} className="sec-pad" style={{ background:bg,padding:"88px 44px",...s }}>
    <div style={{ maxWidth:1160,margin:"0 auto" }}>{children}</div>
  </section>
);

const PageHdr = ({ label, title, sub, light=false }) => (
  <div className="page-hdr-pad" style={{ background: light ? "#1C1B18" : "#1A1917", padding:"128px 44px 56px" }}>
    <div style={{ maxWidth:1160,margin:"0 auto" }}>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:18 }}>
        <div style={{ width:22,height:1.5,background:"#B8102A" }}/>
        <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:10.5,fontWeight:700,color:"#B8102A",letterSpacing:".2em",textTransform:"uppercase" }}>{label}</span>
      </div>
      <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(28px,3.2vw,46px)",fontWeight:600,color:"#fff",lineHeight:1.18,letterSpacing:"-0.02em",maxWidth:660 }}>{title}</h1>
      {sub && <p style={{ fontFamily:"'Figtree',sans-serif",fontSize:15.5,color:"rgba(255,255,255,.56)",lineHeight:1.74,maxWidth:540,marginTop:14 }}>{sub}</p>}
    </div>
  </div>
);

const Ey = ({ label }) => (
  <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:18 }}>
    <div style={{ width:22,height:1.5,background:"#B8102A",flexShrink:0 }}/>
    <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:10.5,fontWeight:700,color:"#B8102A",letterSpacing:".2em",textTransform:"uppercase" }}>{label}</span>
  </div>
);

const H2 = ({ children, s={} }) => (
  <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(25px,2.8vw,40px)",fontWeight:600,lineHeight:1.2,letterSpacing:"-0.02em",color:"#1A1917",...s }}>{children}</h2>
);

const Txt = ({ children, muted=false, s={} }) => (
  <p style={{ fontFamily:"'Figtree',sans-serif",fontSize:15.5,lineHeight:1.78,color: muted ? "#5A5956" : "#3A3835",...s }}>{children}</p>
);

const FF = ({ label, error, children }) => (
  <div style={{ marginBottom:16 }}>
    <label style={{ fontFamily:"'Figtree',sans-serif",fontSize:11.5,fontWeight:600,color:"#1A1917",letterSpacing:".04em",textTransform:"uppercase",display:"block",marginBottom:6 }}>{label}</label>
    {children}
    {error && <div className="err">{error}</div>}
  </div>
);

const Avatar = ({ initials, color, size=68 }) => (
  <div style={{ width:size,height:size,borderRadius:"50%",background:color+"15",border:`1.5px solid ${color}28`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
    <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:size*.36,fontWeight:600,color,letterSpacing:".04em" }}>{initials}</span>
  </div>
);

/* ══════════ NAV ══════════════════════════════════════ */

const Nav = ({ go, page, session, isAdmin, onSignIn, onSignOut }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [mobileProgramsOpen, setMobileProgramsOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Close navigation menus on page change */
  useEffect(() => {
    setMobileOpen(false);
    setProgramsOpen(false);
    setMobileProgramsOpen(false);
  }, [page]);

  /* Close mobile nav on click outside */
  useEffect(() => {
    if (!mobileOpen) return;
    const fn = (e) => {
      if (!e.target.closest("[data-mobile-nav]")) setMobileOpen(false);
    };
    const t = setTimeout(() => window.addEventListener("click", fn), 0);
    return () => { clearTimeout(t); window.removeEventListener("click", fn); };
  }, [mobileOpen]);

  /* Close desktop Programs dropdown on click outside */
  useEffect(() => {
    if (!programsOpen) return;
    const fn = (e) => {
      if (!e.target.closest("[data-programs-menu]")) setProgramsOpen(false);
    };
    const t = setTimeout(() => window.addEventListener("click", fn), 0);
    return () => { clearTimeout(t); window.removeEventListener("click", fn); };
  }, [programsOpen]);

  const mainLinksBeforePrograms = [
    ["About","about"],
    ["Research","research"],
  ];

  const mainLinksAfterPrograms = [
    ["Mentors","mentors"],
    ["Team","team"],
    ["Blog","blog"],
    ["FAQs","faqs"],
    ["Contact","contact"],
  ];

  const programsActive = page === "fellowship" || page === "apply" || page === "courses" || page === "course-apply" || page === "facilitator" || page === "facilitator-module" || page === "participant" || page === "participant-module" || page === "course-admin";

  /*
    Colour logic:
    - Home page: hero background is light (#F7F6F2) → use dark text
    - All other pages: PageHdr background is #1A1917 (very dark) → use white text when not scrolled
    - Once scrolled (> 24 px): nav gets solid white background → always dark text
  */
  const needsDark = scrolled || page === "home";
  const textCol   = needsDark ? "#1A1917"                : "rgba(255,255,255,.88)";
  const activeCol = needsDark ? "#B8102A"                : "#ffffff";
  const logoLight = !needsDark;

  const DesktopLink = ({ label, target }) => (
    <button
      className="nb"
      onClick={() => go(target)}
      style={{
        color: page===target ? activeCol : textCol,
        padding:"0 10px",
        borderBottom: page===target ? `1.5px solid ${activeCol}` : "1.5px solid transparent",
        paddingBottom:2,marginBottom:-2,
        transition:"color .18s",
      }}
    >{label}</button>
  );

  const MobileLink = ({ label, target }) => (
    <button
      style={{
        fontFamily:"'Figtree',sans-serif",
        fontSize:15,
        fontWeight: page===target ? 600 : 400,
        color: page===target ? "#B8102A" : "#1A1917",
        padding:"12px 0",textAlign:"left",
        background:"none",border:"none",
        borderBottom:"1px solid var(--brd)",
        cursor:"pointer",letterSpacing:".01em",
      }}
      onClick={() => { go(target); setMobileOpen(false); }}
    >{label}</button>
  );

  return (
    <>
      <nav
        aria-label="Primary navigation"
        style={{
          position:"fixed",top:0,left:0,right:0,zIndex:300,
          height:68,display:"flex",alignItems:"center",
          background: scrolled ? "#ffffff" : "transparent",
          borderBottom: scrolled ? "1px solid #E5E3DE" : "none",
          transition:"background .28s ease,border-color .28s ease",
        }}
      >
        <div style={{ width:"100%",maxWidth:1360,margin:"0 auto",padding:"0 44px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <Logo size={20} onClick={() => go("home")} light={logoLight}/>

          {/* Desktop links */}
          <div className="nl" style={{ display:"flex",alignItems:"center",gap:0 }}>
            {mainLinksBeforePrograms.map(([l,p]) => <DesktopLink key={p} label={l} target={p}/>)}

            {/* Programs dropdown */}
            <div data-programs-menu style={{ position:"relative" }}>
              <button
                className="nb"
                aria-haspopup="menu"
                aria-expanded={programsOpen}
                onClick={() => setProgramsOpen(o => !o)}
                style={{
                  color: programsActive ? activeCol : textCol,
                  padding:"0 10px",
                  borderBottom: programsActive ? `1.5px solid ${activeCol}` : "1.5px solid transparent",
                  paddingBottom:2,marginBottom:-2,
                  transition:"color .18s",
                  display:"flex",alignItems:"center",gap:5,
                }}
              >
                Programs
                <span aria-hidden="true" style={{ fontSize:10,display:"inline-block",transform:programsOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform .18s" }}>▼</span>
              </button>

              {programsOpen && (
                <div className="dd" role="menu" style={{ left:0,right:"auto",minWidth:170 }}>
                  <button role="menuitem" onClick={() => go("fellowship")}>Fellowships</button>
                  <button role="menuitem" onClick={() => go("courses")}>Courses</button>
                </div>
              )}
            </div>

            {mainLinksAfterPrograms.map(([l,p]) => <DesktopLink key={p} label={l} target={p}/>)}
          </div>

          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            {/* Hamburger — shown only on mobile via CSS */}
            <button
              data-mobile-nav
              className="mob-btn"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              style={{
                display:"none",
                flexDirection:"column",alignItems:"center",justifyContent:"center",
                gap:5,padding:"6px",width:34,height:34,
                background:"none",border:"none",cursor:"pointer",
              }}
              onClick={() => setMobileOpen(o => !o)}
            >
              <span style={{ display:"block",width:20,height:1.5,background:textCol,transition:"background .28s" }}/>
              <span style={{ display:"block",width:20,height:1.5,background:textCol,transition:"background .28s" }}/>
              <span style={{ display:"block",width:13,height:1.5,background:textCol,transition:"background .28s" }}/>
            </button>

            {session ? (
              <div data-account-menu style={{ position:"relative",display:"flex",alignItems:"center",gap:8 }}>
                {isAdmin && <button className="nb" onClick={() => go("course-admin")} style={{ color:textCol,fontSize:12 }}>Course Admin</button>}
                <button className="nb" onClick={onSignOut} title="Sign out" style={{ color:textCol,maxWidth:150,overflow:"hidden",textOverflow:"ellipsis" }}>{session.user.email || "Account"}</button>
              </div>
            ) : (
              <button className="nb" onClick={onSignIn} style={{ color:textCol,padding:"4px 8px" }}>Sign in</button>
            )}
            <button className="nbr" onClick={() => go("team")}>Join Our Team</button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          data-mobile-nav
          role="navigation"
          aria-label="Mobile navigation"
          style={{
            position:"fixed",top:68,left:0,right:0,
            background:"#ffffff",borderBottom:"1px solid #E5E3DE",
            zIndex:299,padding:"16px 24px 22px",
            display:"flex",flexDirection:"column",
            boxShadow:"0 8px 28px rgba(0,0,0,.1)",
            maxHeight:"calc(100vh - 68px)",overflowY:"auto",
          }}
        >
          {mainLinksBeforePrograms.map(([l,p]) => <MobileLink key={p} label={l} target={p}/>)}

          <button
            aria-expanded={mobileProgramsOpen}
            style={{
              fontFamily:"'Figtree',sans-serif",fontSize:15,
              fontWeight:programsActive?600:400,
              color:programsActive?"#B8102A":"#1A1917",
              padding:"12px 0",textAlign:"left",background:"none",border:"none",
              borderBottom:"1px solid var(--brd)",cursor:"pointer",letterSpacing:".01em",
              display:"flex",alignItems:"center",justifyContent:"space-between",
            }}
            onClick={() => setMobileProgramsOpen(o => !o)}
          >
            <span>Programs</span>
            <span aria-hidden="true" style={{ fontSize:10,transform:mobileProgramsOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform .18s" }}>▼</span>
          </button>

          {mobileProgramsOpen && (
            <div style={{ padding:"4px 0 4px 16px",borderBottom:"1px solid var(--brd)" }}>
              <button
                onClick={() => { go("fellowship"); setMobileOpen(false); }}
                style={{ display:"block",width:"100%",textAlign:"left",padding:"10px 0",background:"none",border:"none",fontFamily:"'Figtree',sans-serif",fontSize:14,color:page==="fellowship"?"#B8102A":"#5A5956",cursor:"pointer" }}
              >Fellowships</button>
              <button
                onClick={() => { go("courses"); setMobileOpen(false); }}
                style={{ display:"block",width:"100%",textAlign:"left",padding:"10px 0",background:"none",border:"none",fontFamily:"'Figtree',sans-serif",fontSize:14,color:page==="courses"?"#B8102A":"#5A5956",cursor:"pointer" }}
              >Courses</button>
            </div>
          )}

          {mainLinksAfterPrograms.map(([l,p]) => <MobileLink key={p} label={l} target={p}/>)}

          {session ? (
            <>
              {isAdmin && <MobileLink label="Course Admin" target="course-admin"/>}
              <button className="bn" onClick={()=>{onSignOut();setMobileOpen(false);}} style={{ textAlign:"left",padding:"12px 0",fontSize:14,color:"#5A5956" }}>{session.user.email || "Sign out"} · Sign out</button>
            </>
          ) : (
            <button className="bn" onClick={()=>{onSignIn();setMobileOpen(false);}} style={{ textAlign:"left",padding:"12px 0",fontSize:15,color:"#B8102A",fontWeight:600 }}>Sign in</button>
          )}
          <button
            className="br"
            style={{ marginTop:16,textAlign:"center" }}
            onClick={() => { go("team"); setMobileOpen(false); }}
          >Join Our Team →</button>
        </div>
      )}
    </>
  );
};

/* ══════════ HERO ════════════════════════════════════ */

const Hero = ({ go }) => (
  <section className="pat-lt hero-pad" style={{ background:"#F7F6F2",minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"108px 44px 80px",position:"relative",overflow:"hidden" }}>
    <div className="aflt" style={{ position:"absolute",right:"-2%",top:"50%",transform:"translateY(-50%)",width:"40vw",maxWidth:500,opacity:.055,pointerEvents:"none" }}>
      <AfricaSvg style={{ width:"100%",height:"auto",color:"#1A1917" }}/>
    </div>
    <div style={{ maxWidth:1160,margin:"0 auto",width:"100%",position:"relative",zIndex:2 }}>
      <div style={{ maxWidth:680 }}>
        <div className="ha" style={{ display:"flex",alignItems:"center",gap:10,marginBottom:26 }}>
          <div style={{ width:22,height:1.5,background:"#B8102A" }}/>
          <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:10.5,fontWeight:700,color:"#B8102A",letterSpacing:".2em",textTransform:"uppercase" }}>Research Initiative · Africa</span>
        </div>
        <h1 className="ha" style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(34px,4.6vw,66px)",fontWeight:600,color:"#1A1917",lineHeight:1.1,letterSpacing:"-0.025em",marginBottom:24 }}>
          Advancing Research on<br/><em style={{ fontStyle:"italic" }}>Biosecurity, AI, and</em><br/>Emerging Technologies in Africa
        </h1>
        <p className="hb" style={{ fontFamily:"'Figtree',sans-serif",fontSize:17,color:"#5A5956",lineHeight:1.76,maxWidth:510,marginBottom:12 }}>
          AIxbio Africa is an independent research initiative working at the intersection of biosecurity, artificial intelligence, and emerging technology governance.
        </p>
        <p className="hb" style={{ fontFamily:"'Figtree',sans-serif",fontSize:17,color:"#5A5956",lineHeight:1.76,maxWidth:510,marginBottom:36 }}>
          We conduct research, support capacity-building, and foster interdisciplinary collaboration to better understand and manage technological and biological risks in African contexts.
        </p>
        <div className="hc" style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
          <button className="br" style={{ padding:"13px 28px" }} onClick={() => go("research")}>Explore Our Research</button>
          <button className="bo" style={{ padding:"12px 22px" }} onClick={() => go("fellowship")}>Fellowship Programme →</button>
        </div>
        <div className="hd" style={{ display:"flex",gap:40,marginTop:48,paddingTop:32,borderTop:"1px solid var(--brd)",flexWrap:"wrap" }}>
          {[["6","Research areas"],["5 weeks","Fellowship duration"],["2026","Launch year"]].map(([n,l]) => (
            <div key={l}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,color:"#1A1917",lineHeight:1 }}>{n}</div>
              <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10.5,color:"#9A9896",letterSpacing:".06em",textTransform:"uppercase",marginTop:5 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ══════════ HOME SECTIONS ═══════════════════════════ */

const HomeAbout = ({ go }) => (
  <Sec bg="#fff">
    <div className="g2" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,alignItems:"start" }}>
      <div className="reveal">
        <Ey label="About"/>
        <H2 s={{ marginBottom:22 }}>Work in Africa, Relevant to the World</H2>
        <Txt s={{ marginBottom:16 }}>AIxbio Africa was founded on a straightforward observation: biological and technological risks do not align with the distribution of scientific capacity. Africa carries a disproportionate share of emerging biological risk and is underrepresented in global biosecurity research, pandemic preparedness, and emerging technology governance.</Txt>
        <Txt s={{ marginBottom:28 }}>Our work spans research, training, and policy engagement. We study biosecurity challenges in African contexts, examine how emerging technologies intersect with biological risks, and build research capacity among African scientists and practitioners.</Txt>
        <button className="bo" onClick={() => go("about")}>About AIxbio Africa →</button>
      </div>
      <div>
        {[["01","Research","We investigate biosecurity challenges, emerging biological risks, and how advanced technologies interact with biological systems in African contexts."],["02","Train","We design fellowship programmes, workshops, and mentorship structures for African researchers entering biosecurity and emerging technology fields."],["03","Advise","Where our research has policy implications, we communicate findings clearly to relevant institutions and decision-makers."]].map(([n,t,d],i)=>(
          <div key={n} className={`reveal d${i+1}`} style={{ display:"flex",gap:22,padding:"24px 0",borderBottom:i<2?"1px solid var(--brd)":"none" }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:11.5,fontWeight:700,color:"#B8102A",letterSpacing:".05em",paddingTop:3,flexShrink:0 }}>{n}</span>
            <div>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:"#1A1917",marginBottom:6,lineHeight:1.2 }}>{t}</h3>
              <Txt muted s={{ fontSize:14.5 }}>{d}</Txt>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Sec>
);

const HomeResearch = ({ go }) => (
  <Sec id="research">
    <div className="reveal" style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:48,flexWrap:"wrap",gap:16 }}>
      <div><Ey label="Research"/><H2>Research Areas</H2></div>
      <button className="bo" onClick={() => go("research")}>All Research →</button>
    </div>
    <div style={{ display:"flex",flexDirection:"column",gap:0 }}>
      {RESEARCH.map(({ id,tag,tc,title,short,slug },i) => (
        <div key={id} className="reveal lft" onClick={() => go("research-detail",{slug})}
          style={{ display:"grid",gridTemplateColumns:"56px 1fr auto",gap:24,padding:"22px 0",borderTop:"1px solid var(--brd)",cursor:"pointer",alignItems:"center" }}>
          <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:13,fontWeight:600,color:"rgba(26,25,23,.22)" }}>{id}</span>
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:5 }}>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:"#1A1917" }}>{title}</h3>
              <span className={`tag ${tc}`}>{tag}</span>
            </div>
            <Txt muted s={{ fontSize:14 }}>{short}</Txt>
          </div>
          <span style={{ color:"#B8102A",fontSize:18,flexShrink:0 }}>→</span>
        </div>
      ))}
      <div style={{ borderTop:"1px solid var(--brd)" }}/>
    </div>
  </Sec>
);

const Spotlight = ({ go }) => (
  <section className="pat-dk sec-pad" style={{ background:"#1C1B18",padding:"88px 44px",position:"relative",overflow:"hidden" }}>
    <div style={{ position:"absolute",right:"-2%",bottom:"-4%",width:"32vw",maxWidth:420,opacity:.05,pointerEvents:"none" }}>
      <AfricaSvg style={{ width:"100%",height:"auto",color:"#fff" }}/>
    </div>
    <div style={{ maxWidth:1160,margin:"0 auto",position:"relative",zIndex:2 }}>
      <Ey label="Research Spotlight"/>
      <div className="g2" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:68,alignItems:"start" }}>
        <div className="reveal">
          <span className="tag tr" style={{ marginBottom:20,display:"inline-block" }}>Pilot Study · 2026</span>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(23px,2.6vw,38px)",fontWeight:600,color:"#fff",lineHeight:1.22,letterSpacing:"-0.02em",marginBottom:20 }}>AI Safety Guardrails and African Language Contexts</h2>
          <Txt s={{ color:"rgba(255,255,255,.6)",marginBottom:16 }}>We tested whether frontier AI models maintain consistent safety behavior when biosecurity-sensitive information is expressed in African indigenous terminology rather than standard English clinical language.</Txt>
          <Txt s={{ color:"rgba(255,255,255,.6)",marginBottom:16 }}>The finding reflects a training data gap — not a jailbreak exploit — with practical implications for how AI biosecurity tools perform in African settings.</Txt>
          <Txt s={{ color:"rgba(255,255,255,.48)",fontSize:14.5,fontStyle:"italic",marginBottom:30 }}>A full paper is in preparation. A preprint will be published here when available.</Txt>
          <button className="bg" onClick={() => go("blog-post",{slug:"guardrails-african-language"})}>Read the Discussion →</button>
        </div>
        <div className="reveal d2" style={{ display:"flex",flexDirection:"column",gap:12 }}>
          {[{stat:"47%",label:"Hazardous response rate",d:"of prompts using indigenous terminology produced hazardous responses, versus 67% under English clinical framing."},
            {stat:"20%",label:"Refusal rate",d:"under ethnoveterinary framing, compared to 33% using English — a significant and reproducible behavioral shift."},
            {stat:"0%",label:"Threat recognition",d:"of responses correctly identified the indigenous term as corresponding to a listed biological threat agent."}
          ].map(({ stat,label,d },i) => (
            <div key={i} style={{ background:"rgba(255,255,255,.045)",border:"1px solid rgba(255,255,255,.09)",padding:"20px 22px" }}>
              <div style={{ display:"flex",alignItems:"center",gap:16 }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:38,fontWeight:700,color:"#B8102A",lineHeight:1,flexShrink:0 }}>{stat}</div>
                <div>
                  <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10,fontWeight:700,color:"rgba(255,255,255,.35)",letterSpacing:".09em",textTransform:"uppercase",marginBottom:5 }}>{label}</div>
                  <Txt s={{ fontSize:13,lineHeight:1.62,color:"rgba(255,255,255,.56)" }}>{d}</Txt>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const HomeFellowship = ({ go }) => (
  <Sec bg="#fff" id="fellowship">
    <div className="g2" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,alignItems:"center" }}>
      <div className="reveal">
        <Ey label="Fellowship"/>
        <H2 s={{ marginBottom:16 }}>5-Week Research Fellowship</H2>
        <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(90,89,86,.08)",border:"1px solid rgba(90,89,86,.22)",padding:"7px 14px",marginBottom:18 }}>
          <span style={{ width:7,height:7,borderRadius:"50%",background:"#5A5956",flexShrink:0,display:"inline-block" }}/>
          <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:11.5,fontWeight:700,color:"#5A5956",letterSpacing:".06em",textTransform:"uppercase" }}>Fellow Applications Closed</span>
        </div>
        <Txt s={{ marginBottom:16 }}>The AIxBio Africa Research Fellowship is a 5-week remote research programme for aspiring and early-career researchers interested in producing rigorous, impactful work on AI, biosecurity, health systems, governance, and related societal challenges in Africa.</Txt>
        <Txt muted s={{ marginBottom:28,fontSize:14.5 }}>Fellows pursue independent research projects aligned with AIxBio Africa's mission and produce a substantial research output suitable for publication. The programme is offered at no cost to participants.</Txt>
        <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
          <button className="bo" onClick={() => go("fellowship")}>Programme Details →</button>
          <button className="br" onClick={() => go("mentors")}>Become a Mentor →</button>
        </div>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
        {[["AI and Biosecurity","Safety evaluation, dual-use research governance, and biosecurity threats in African contexts."],["AI and Health Systems","How AI intersects with public health infrastructure and surveillance in Africa."],["AI Governance and Policy","Policy frameworks, regulation, and responsible technology deployment."],["Societal Impacts of AI in Africa","How AI affects communities, institutions, and public good in African societies."]].map(([title,desc],i) => (
          <div key={title} className={`reveal d${i+1}`} style={{ display:"flex",gap:18,padding:"18px 22px",background:"#F7F6F2",border:"1px solid var(--brd)" }}>
            <div style={{ flexShrink:0 }}>
              <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10,fontWeight:700,color:"#B8102A",letterSpacing:".1em",textTransform:"uppercase" }}>Area {i+1}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:600,color:"#1A1917",marginTop:4,lineHeight:1.3 }}>{title}</div>
            </div>
            <div style={{ borderLeft:"1.5px solid var(--brd)",paddingLeft:18 }}>
              <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:13,color:"#5A5956",lineHeight:1.6 }}>{desc}</div>
            </div>
          </div>
        ))}
        <button className="bn" onClick={() => go("fellowship")} style={{ fontFamily:"'Figtree',sans-serif",fontSize:12.5,color:"#B8102A",fontWeight:600,letterSpacing:".04em",textTransform:"uppercase",textAlign:"left",padding:"4px 0" }}>View programme details →</button>
      </div>
    </div>
  </Sec>
);

const HomeBlog = ({ go }) => (
  <Sec id="blog">
    <div className="reveal" style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:48,flexWrap:"wrap",gap:16 }}>
      <div><Ey label="Insights"/><H2>Recent Writing</H2></div>
      <button className="bo" onClick={() => go("blog")}>All Posts →</button>
    </div>
    <div className="g3" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20 }}>
      {BLOG.slice(0,3).map(({ slug,cat,tc,date,rt,title,excerpt },i) => (
        <div key={slug} className="lft reveal" onClick={() => go("blog-post",{slug})} style={{ background:"#fff",border:"1px solid var(--brd)",padding:"26px 24px",cursor:"pointer",display:"flex",flexDirection:"column",gap:12 }}>
          <span className={`tag ${tc}`}>{cat}</span>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:600,color:"#1A1917",lineHeight:1.35,flex:1 }}>{title}</h3>
          <Txt muted s={{ fontSize:13.5 }}>{excerpt}</Txt>
          <div style={{ borderTop:"1px solid var(--brd)",paddingTop:12,display:"flex",justifyContent:"space-between" }}>
            <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:11.5,color:"#9A9896" }}>{date} · {rt}</span>
            <span style={{ color:"#B8102A",fontWeight:600 }}>→</span>
          </div>
        </div>
      ))}
    </div>
  </Sec>
);

const HomeNewsletter = ({ addSub }) => {
  const [email,setEmail] = useState(""); const [done,setDone] = useState(false);
  const sub = () => { if (email.includes("@") && email.includes(".")) { addSub(email); setDone(true); } };
  return (
    <section className="sec-pad" style={{ background:"#1C1B18",padding:"72px 44px",position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",right:"-1%",top:"50%",transform:"translateY(-50%)",width:"24vw",maxWidth:300,opacity:.06,pointerEvents:"none" }}>
        <AfricaSvg style={{ width:"100%",height:"auto",color:"#fff" }}/>
      </div>
      <div style={{ maxWidth:520,margin:"0 auto",textAlign:"center",position:"relative",zIndex:2 }}>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(22px,2.6vw,36px)",fontWeight:600,color:"#fff",lineHeight:1.2,marginBottom:12 }}>Stay Informed</h2>
        <Txt s={{ color:"rgba(255,255,255,.55)",marginBottom:28,fontSize:15.5 }}>Research updates, fellowship announcements, and occasional writing — delivered to your inbox.</Txt>
        {!done ? (
          <div style={{ display:"flex",maxWidth:400,margin:"0 auto" }}>
            <input type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sub()}
              style={{ flex:1,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",borderRight:"none",color:"#fff",padding:"11px 14px" }}/>
            <button onClick={sub} style={{ background:"#B8102A",color:"#fff",border:"none",padding:"11px 20px",fontFamily:"'Figtree',sans-serif",fontSize:12,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",cursor:"pointer",flexShrink:0,transition:"background .2s" }}
              onMouseEnter={e=>e.target.style.background="#8A0D20"} onMouseLeave={e=>e.target.style.background="#B8102A"}>Subscribe</button>
          </div>
        ) : (
          <div style={{ padding:"14px 24px",background:"rgba(255,255,255,.1)",color:"#fff",fontFamily:"'Figtree',sans-serif",fontSize:14,border:"1px solid rgba(255,255,255,.18)" }}>
            ✓ Subscribed. We'll be in touch.
          </div>
        )}
        <p style={{ fontFamily:"'Figtree',sans-serif",fontSize:11.5,color:"rgba(255,255,255,.3)",marginTop:12 }}>No spam. Unsubscribe at any time.</p>
      </div>
    </section>
  );
};

/* HomePartners removed — unverified affiliations omitted for credibility */

const HomeTeamCta = ({ go }) => (
  <section className="sec-pad" style={{ background:"#F7F6F2",padding:"72px 44px",borderTop:"1px solid var(--brd)" }}>
    <div style={{ maxWidth:1160,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:20 }}>
      <div style={{ maxWidth:620 }}>
        <Ey label="Join Our Founding Team"/>
        <H2 s={{ marginBottom:10 }}>Help Build AIxBio Africa</H2>
        <Txt muted s={{ fontSize:15 }}>We're assembling a small founding team of volunteers to help build AIxBio Africa from the ground up.</Txt>
      </div>
      <button className="br" onClick={() => go("team")} style={{ flexShrink:0 }}>Join Our Team →</button>
    </div>
  </section>
);

const HomePage = ({ go, addSub }) => (<>
  <Hero go={go}/><HomeAbout go={go}/><HomeResearch go={go}/>
  <Spotlight go={go}/><HomeFellowship go={go}/><HomeBlog go={go}/>
  <HomeTeamCta go={go}/><HomeNewsletter addSub={addSub}/>
</>);

/* ══════════ RESEARCH PAGES ══════════════════════════ */

const ResearchPage = ({ go }) => (<>
  <PageHdr label="Research" title="Our Research Areas" sub="Six interconnected areas at the intersection of AI safety, biosecurity, and African scientific capacity."/>
  <Sec bg="#fff">
    <div style={{ display:"flex",flexDirection:"column" }}>
      {RESEARCH.map(({ id,tag,tc,title,short,slug },i) => (
        <div key={id} className="reveal lft" onClick={() => go("research-detail",{slug})}
          style={{ display:"grid",gridTemplateColumns:"56px 1fr 100px",gap:24,padding:"26px 0",borderTop:"1px solid var(--brd)",cursor:"pointer",alignItems:"start" }}>
          <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:13,fontWeight:600,color:"rgba(26,25,23,.2)",paddingTop:3 }}>{id}</span>
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8 }}>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:"#1A1917" }}>{title}</h3>
              <span className={`tag ${tc}`}>{tag}</span>
            </div>
            <Txt muted s={{ fontSize:14.5 }}>{short}</Txt>
          </div>
          <div style={{ textAlign:"right",paddingTop:3 }}>
            <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:12,fontWeight:600,color:"#B8102A",letterSpacing:".04em",textTransform:"uppercase" }}>Read more →</span>
          </div>
        </div>
      ))}
      <div style={{ borderTop:"1px solid var(--brd)" }}/>
    </div>
  </Sec>
</>);

const ResearchDetail = ({ slug, go }) => {
  const item = RESEARCH.find(r=>r.slug===slug);
  if (!item) return <Sec><Txt>Not found.</Txt></Sec>;
  return (<>
    <PageHdr label={item.tag} title={item.title}/>
    <Sec bg="#fff">
      <div style={{ display:"grid",gridTemplateColumns:"1fr 300px",gap:60 }} className="g2r">
        <article>
          {item.body.split("\n\n").map((p,i)=><Txt key={i} s={{ marginBottom:20 }}>{p}</Txt>)}
          <div style={{ marginTop:40,paddingTop:32,borderTop:"1px solid var(--brd)",display:"flex",gap:12 }}>
            <button className="br" onClick={() => go("contact")}>Discuss This Research</button>
            <button className="bo" onClick={() => go("research")}>All Research</button>
          </div>
        </article>
        <div>
          <div style={{ background:"#F7F6F2",padding:"22px",border:"1px solid var(--brd)",marginBottom:16 }}>
            <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10.5,fontWeight:700,color:"#5A5956",letterSpacing:".12em",textTransform:"uppercase",marginBottom:12 }}>Related Areas</div>
            {RESEARCH.filter(r=>r.slug!==slug).slice(0,3).map(r => (
              <div key={r.slug} onClick={()=>go("research-detail",{slug:r.slug})} style={{ padding:"10px 0",borderBottom:"1px solid var(--brd)",cursor:"pointer" }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:600,color:"#1A1917" }}>{r.title}</div>
              </div>
            ))}
          </div>
          <button className="bo" style={{ width:"100%" }} onClick={()=>go("contact")}>Collaborate →</button>
        </div>
      </div>
    </Sec>
  </>);
};

/* ══════════ ABOUT ═══════════════════════════════════ */

const AboutPage = ({ go }) => (<>
  <PageHdr label="About" title="About AIxbio Africa" sub="An independent African research initiative focused on biosecurity, AI, and the responsible development of emerging technologies."/>
  <Sec bg="#fff">
    {/* Mission and trajectory */}
    <div className="g2" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,marginBottom:60 }}>
      <div className="reveal">
        <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,color:"#1A1917",marginBottom:16,lineHeight:1.2 }}>Why we exist</h3>
        <Txt s={{ marginBottom:14 }}>Biological and technological risks do not align with the distribution of scientific capacity. Africa faces significant biosecurity challenges — a high burden of zoonotic disease, emerging biological risks, and limited representation in global research, pandemic preparedness, and technology governance frameworks.</Txt>
        <Txt s={{ marginBottom:14 }}>Emerging technologies, including advanced AI, are increasingly relevant to how biological risks are studied, managed, and communicated. Understanding how these technologies interact with African contexts requires researchers grounded in both the science and the setting.</Txt>
        <Txt>This is not work for Africa in isolation. Biosecurity failures anywhere affect global health security. The capacity we build and the questions we investigate have implications beyond the continent.</Txt>
      </div>
      <div className="reveal d2">
        <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,color:"#1A1917",marginBottom:16,lineHeight:1.2 }}>What we are building</h3>
        <Txt s={{ marginBottom:14 }}>We are a new organisation. We do not have a large team or an established funding base. We have a clear research agenda, a commitment to methodological rigour, and a determination to build something credible and durable.</Txt>
        <Txt s={{ marginBottom:14 }}>In the near term, we are focused on publishing early research findings, launching our fellowship programme in 2026, and establishing partnerships with African universities and international research institutions working on biosecurity and emerging technology governance.</Txt>
        <Txt>In the longer term, we aim to be a recognised centre for biosecurity and emerging technology research in Africa.</Txt>
      </div>
    </div>

    {/* Pull quote */}
    <div className="reveal" style={{ borderLeft:"2.5px solid #B8102A",paddingLeft:26,marginBottom:56 }}>
      <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(18px,2vw,25px)",fontStyle:"italic",color:"#1A1917",lineHeight:1.5,maxWidth:720 }}>
        AIxbio Africa is an independent African research initiative focused on biosecurity, AI, and the responsible development of emerging technologies.
      </p>
    </div>

    {/* Founder profile */}
    <div className="reveal" style={{ marginBottom:48 }}>
      <Ey label="Founder"/>
      <H2 s={{ marginBottom:24 }}>About the Founder</H2>
      <div style={{ display:"flex",gap:26,alignItems:"flex-start",padding:"28px 30px",background:"#F7F6F2",border:"1px solid var(--brd)",flexWrap:"wrap" }}>
        <Avatar initials="FI" color="#B8102A" size={76}/>
        <div style={{ flex:1,minWidth:240 }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600,color:"#1A1917",marginBottom:3,lineHeight:1.2 }}>Fatika Umar Ibrahim</h3>
          <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:11.5,fontWeight:700,color:"#B8102A",letterSpacing:".08em",textTransform:"uppercase",marginBottom:18 }}>Founder &amp; Executive Director</div>
          <Txt s={{ marginBottom:13 }}>Fatika Umar Ibrahim is an independent biosecurity and AI researcher and a final-year Doctor of Veterinary Medicine (DVM) student at Ahmadu Bello University, Zaria, Nigeria.</Txt>
          <Txt s={{ marginBottom:13 }}>He founded AIxbio Africa to strengthen African capacity at the intersection of biosecurity, artificial intelligence, and emerging technology governance. His work focuses on how advanced technologies intersect with biological risks in African contexts, with particular attention to the role of language, indigenous knowledge, and local ecological conditions in shaping research questions and policy responses.</Txt>
          <Txt muted s={{ fontSize:14.5 }}>Through AIxbio Africa, he aims to support rigorous research, responsible innovation, and accessible pathways for African researchers entering the biosecurity and emerging technology fields.</Txt>
        </div>
      </div>
    </div>

    {/* Actions */}
    <div className="reveal" style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
      <button className="br" onClick={()=>go("research")}>View Research</button>
      <button className="bo" onClick={()=>go("contact")}>Get in Touch</button>
    </div>
  </Sec>
</>);

const FellowInitials = ({ name }) => {
  const initials = name
    .replace(/— TODO/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase();
  return <Avatar initials={initials || "AF"} color="#B8102A" size={72}/>;
};

const FellowStatusBadge = ({ status }) => {
  const cls = status === "Completed" ? "tg" : status === "Under Review" ? "ta" : "tg";
  return <span className={`tag ${cls}`}>{status}</span>;
};

const FellowLinks = ({ links = {}, outputs = [] }) => {
  const linkLabels = { linkedin:"LinkedIn", website:"Website", github:"GitHub", scholar:"Google Scholar", orcid:"ORCID" };
  const available = Object.entries(links).filter(([,url]) => Boolean(url));
  const publishedOutputs = outputs.filter(output => output && output.url);
  if (!available.length && !publishedOutputs.length) return null;
  return (
    <div style={{ display:"flex",gap:10,flexWrap:"wrap",marginTop:16 }}>
      {available.map(([key,url]) => (
        <a key={key} className="fellow-link" href={url} target="_blank" rel="noopener noreferrer" style={{ fontFamily:"'Figtree',sans-serif",fontSize:11.5,fontWeight:700,color:"#B8102A",letterSpacing:".05em",textTransform:"uppercase",textDecoration:"none",borderBottom:"1px solid rgba(184,16,42,.35)",paddingBottom:2 }}>
          {linkLabels[key] || key} ↗
        </a>
      ))}
      {publishedOutputs.map((output,i) => (
        <a key={`${output.label || "Output"}-${i}`} className="fellow-link" href={output.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily:"'Figtree',sans-serif",fontSize:11.5,fontWeight:700,color:"#B8102A",letterSpacing:".05em",textTransform:"uppercase",textDecoration:"none",borderBottom:"1px solid rgba(184,16,42,.35)",paddingBottom:2 }}>
          {output.label || "Research output"} ↗
        </a>
      ))}
    </div>
  );
};

const FellowCard = ({ fellow, expanded, onToggle }) => {
  const detailsId = `fellow-details-${fellow.id}`;
  const isTodo = fellow.name.includes("TODO");

  if (fellow.placeholder) {
    return (
      <article className="fellow-card" style={{ alignSelf:"stretch",overflow:"hidden",minHeight:260 }}>
        <div style={{ minHeight:260,padding:"32px 24px",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center" }}>
          <div style={{ maxWidth:300 }}>
            <div aria-hidden="true" style={{ width:68,height:68,margin:"0 auto 18px",display:"flex",alignItems:"center",justifyContent:"center",background:"#F7F6F2",border:"1px solid var(--brd)" }}>
              <AfricaSvg style={{ width:26,height:"auto",color:"#B8102A",opacity:.45 }}/>
            </div>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:21,fontWeight:600,color:"#1A1917",lineHeight:1.25,marginBottom:8 }}>Fellow profile forthcoming</h3>
            <p style={{ fontFamily:"'Figtree',sans-serif",fontSize:13,color:"#8A8884",lineHeight:1.6 }}>Additional cohort information will be added soon.</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="fellow-card" style={{ alignSelf:"start",overflow:"hidden" }}>
      <div style={{ padding:"24px 24px 20px" }}>
        <div style={{ display:"flex",gap:18,alignItems:"flex-start",marginBottom:20 }}>
          {fellow.image ? (
            <div style={{ width:88,height:108,flexShrink:0,overflow:"hidden",background:"#F0EFEB",border:"1px solid var(--brd)" }}>
              <img src={fellow.image} alt={`${fellow.name} headshot`} style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }}/>
            </div>
          ) : (
            <div aria-label={`Photo placeholder for ${fellow.name}`} style={{ width:88,height:108,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#F7F6F2",border:"1px solid var(--brd)" }}>
              <FellowInitials name={fellow.name}/>
            </div>
          )}
          <div style={{ minWidth:0,flex:1 }}>
            <div style={{ display:"flex",justifyContent:"space-between",gap:10,alignItems:"flex-start",flexWrap:"wrap",marginBottom:6 }}>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:"#1A1917",lineHeight:1.18 }}>{fellow.name}</h3>
              <FellowStatusBadge status={fellow.status}/>
            </div>
            <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:12.5,color:"#5A5956",lineHeight:1.55,marginBottom:5 }}>{fellow.role}</div>
            <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:11.5,fontWeight:600,color:"#8A8884",letterSpacing:".04em",textTransform:"uppercase" }}>{[fellow.affiliation, fellow.country].filter(Boolean).join(" · ")}</div>
          </div>
        </div>

        <h4 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:600,color:"#1A1917",lineHeight:1.35,marginBottom:12 }}>{fellow.projectTitle}</h4>
        <div className="fellow-tags" style={{ marginBottom:14 }}>
          {fellow.researchAreas.map(area => <span key={area} className="tag tl">{area}</span>)}
        </div>
        <Txt muted s={{ fontSize:13.5,lineHeight:1.65,marginBottom:16 }}>
          {isTodo ? fellow.projectSummary : `${fellow.projectSummary.split(". ").slice(0,2).join(". ")}${fellow.projectSummary.includes(". ") ? "." : ""}`}
        </Txt>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,paddingTop:14,borderTop:"1px solid var(--brd)",marginBottom:18 }}>
          <div>
            <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:9.5,fontWeight:700,color:"#9A9896",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4 }}>Mentor</div>
            <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:12.5,color:"#3A3835",lineHeight:1.45 }}>{fellow.mentor.name}</div>
          </div>
          <div>
            <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:9.5,fontWeight:700,color:"#9A9896",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4 }}>Expected Output</div>
            <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:12.5,color:"#3A3835",lineHeight:1.45 }}>{fellow.expectedOutput}</div>
          </div>
        </div>
        <button type="button" className="bn fellow-disclosure" aria-expanded={expanded} aria-controls={detailsId} onClick={onToggle} style={{ width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,textAlign:"left",fontFamily:"'Figtree',sans-serif",fontSize:11.5,fontWeight:700,color:"#B8102A",letterSpacing:".06em",textTransform:"uppercase",padding:"10px 0 2px" }}>
          <span>{expanded ? "Hide research" : "View research"}</span>
          <span aria-hidden="true" style={{ fontSize:16,transform:expanded?"rotate(180deg)":"none",transition:"transform .2s" }}>↓</span>
        </button>
      </div>

      {expanded && (
        <div id={detailsId} className="fellow-details" style={{ borderTop:"1px solid var(--brd)",background:"#F7F6F2",padding:"24px" }}>
          <div style={{ marginBottom:22 }}>
            <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10,fontWeight:700,color:"#B8102A",letterSpacing:".12em",textTransform:"uppercase",marginBottom:7 }}>Research Question</div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:"#1A1917",lineHeight:1.45 }}>{fellow.researchQuestion}</p>
          </div>
          <div style={{ marginBottom:22 }}>
            <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10,fontWeight:700,color:"#5A5956",letterSpacing:".12em",textTransform:"uppercase",marginBottom:7 }}>Project Summary</div>
            <Txt muted s={{ fontSize:13.5,lineHeight:1.72 }}>{fellow.projectSummary}</Txt>
          </div>
          <div style={{ marginBottom:22 }}>
            <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10,fontWeight:700,color:"#5A5956",letterSpacing:".12em",textTransform:"uppercase",marginBottom:7 }}>Why This Matters in the African Context</div>
            <Txt muted s={{ fontSize:13.5,lineHeight:1.72 }}>{fellow.africanContext}</Txt>
          </div>
          <div style={{ marginBottom:22 }}>
            <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10,fontWeight:700,color:"#5A5956",letterSpacing:".12em",textTransform:"uppercase",marginBottom:9 }}>Methodology / Approach</div>
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {fellow.methodology.map((item,i) => (
                <div key={i} style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
                  <span style={{ color:"#B8102A",fontWeight:700,flexShrink:0 }}>—</span>
                  <Txt muted s={{ fontSize:13.5,lineHeight:1.6 }}>{item}</Txt>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:22 }}>
            <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10,fontWeight:700,color:"#5A5956",letterSpacing:".12em",textTransform:"uppercase",marginBottom:9 }}>Research Areas</div>
            <div className="fellow-tags">{fellow.researchAreas.map(area => <span key={area} className="tag tl">{area}</span>)}</div>
          </div>
          <div style={{ marginBottom:22 }}>
            <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10,fontWeight:700,color:"#5A5956",letterSpacing:".12em",textTransform:"uppercase",marginBottom:7 }}>Fellow Bio</div>
            <Txt muted s={{ fontSize:13.5,lineHeight:1.72 }}>{fellow.bio}</Txt>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,paddingTop:18,borderTop:"1px solid var(--brd)" }} className="g2">
            <div>
              <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10,fontWeight:700,color:"#5A5956",letterSpacing:".12em",textTransform:"uppercase",marginBottom:6 }}>Mentor</div>
              <Txt muted s={{ fontSize:13.5 }}>{fellow.mentor.name}{fellow.mentor.affiliation ? ` · ${fellow.mentor.affiliation}` : ""}</Txt>
            </div>
            <div>
              <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10,fontWeight:700,color:"#5A5956",letterSpacing:".12em",textTransform:"uppercase",marginBottom:6 }}>Expected Output</div>
              <Txt muted s={{ fontSize:13.5 }}>{fellow.expectedOutput}</Txt>
              {!fellow.outputs.length && <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10.5,fontWeight:700,color:"#8A8884",letterSpacing:".08em",textTransform:"uppercase",marginTop:7 }}>Research in progress</div>}
            </div>
          </div>
          <FellowLinks links={fellow.links} outputs={fellow.outputs}/>
        </div>
      )}
    </article>
  );
};

const CurrentCohort = () => {
  const [expandedIds,setExpandedIds] = useState({});
  const toggleFellow = id => setExpandedIds(current => ({ ...current, [id]: !current[id] }));
  return (
    <div className="reveal" style={{ marginBottom:64 }}>
      <Ey label="2026 Pilot Cohort"/>
      <H2 s={{ marginBottom:12 }}>Current Cohort</H2>
      <Txt muted s={{ maxWidth:760,marginBottom:32 }}>Meet the researchers in AIxBio Africa's current fellowship cohort and explore the questions they are investigating at the intersection of artificial intelligence, biosecurity, governance, public health, and emerging technologies.</Txt>
      <div className="fg" style={{ display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:18,alignItems:"start" }}>
        {FELLOWS.map(fellow => (
          <FellowCard key={fellow.id} fellow={fellow} expanded={Boolean(expandedIds[fellow.id])} onToggle={() => toggleFellow(fellow.id)}/>
        ))}
      </div>
    </div>
  );
};

/* ══════════ FELLOWSHIP PAGE ════════════════════════ */

const FellowshipPage = ({ go, addApp, startTab = "overview" }) => {
  const [tab,setTab] = useState(startTab);
  const [step,setStep] = useState(1);
  const [fd,setFd] = useState({ name:"",email:"",country:"",institution:"",stage:"",area:"",background:"",statement:"",question:"",ref1name:"",ref1email:"",terms:false,draft:false });
  const [errs,setErrs] = useState({});
  const [submitting,setSubmitting] = useState(false);
  const [done,setDone] = useState(false);

  /* Re-run IntersectionObserver whenever tab changes so newly mounted
     .reveal elements inside each tab panel become visible */
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } }),
      { threshold: 0.05, rootMargin: "0px 0px -16px 0px" }
    );
    const t = setTimeout(() => document.querySelectorAll(".reveal:not(.in)").forEach(el => obs.observe(el)), 60);
    return () => { obs.disconnect(); clearTimeout(t); };
  }, [tab]);

  const upd = k => e => setFd(f=>({...f,[k]: e.target.type==="checkbox" ? e.target.checked : e.target.value}));

  const validate = (s) => {
    const e = {};
    if (s===1) { if (!fd.name.trim()) e.name="Required"; if (!fd.email.includes("@")) e.email="Valid email required"; if (!fd.country.trim()) e.country="Required"; }
    if (s===2) { if (!fd.stage) e.stage="Required"; if (!fd.area) e.area="Required"; if (fd.background.trim().length<30) e.background="Please provide some background (30+ chars)"; }
    if (s===3) { if (fd.statement.trim().length<80) e.statement="Please write at least a brief statement of interest"; if (fd.question.trim().length<20) e.question="Please describe a research question you find interesting"; }
    if (s===4) { if (!fd.terms) e.terms="Please confirm you have read the programme details"; }
    return e;
  };

  const next = () => {
    const e = validate(step);
    if (Object.keys(e).length) { setErrs(e); return; }
    setErrs({}); setStep(s=>s+1);
  };

  const submit = () => {
    const e = validate(4);
    if (Object.keys(e).length) { setErrs(e); return; }
    setSubmitting(true);
    setTimeout(() => { addApp({...fd,ref:`AIX-2026-${String(Date.now()).slice(-5)}`}); setDone(true); setSubmitting(false); }, 900);
  };

  const TABS = [["overview","Overview"],["eligibility","Eligibility"],["mentors","Mentors"],["faqs","FAQs"],["apply","Apply"]];

  return (<>
    <PageHdr label="Fellowship" title="AIxBio Africa Research Fellowship – Pilot Cohort 2026" sub="A 5-week remote research programme for aspiring and early-career researchers working on AI, biosecurity, health systems, governance, and societal challenges in Africa."/>

    {/* Fellow applications closed / mentor call banner */}
    <div style={{ background:"#1A1917",padding:"14px 44px" }}>
      <div style={{ maxWidth:1160,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12 }}>
        <div style={{ display:"flex",alignItems:"center",gap:12,flexWrap:"wrap" }}>
          <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:13,fontWeight:700,color:"rgba(255,255,255,.85)",letterSpacing:".06em",textTransform:"uppercase" }}>Fellow Applications Closed</span>
          <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:13,color:"rgba(255,255,255,.55)" }}>Now welcoming applications from prospective <strong style={{ color:"#fff" }}>mentors</strong> for the pilot cohort.</span>
        </div>
        <a href="https://airtable.com/apph1o7t9K13CL84h/pag73OEGWci1TN0uN/form" target="_blank" rel="noopener noreferrer"
          style={{ fontFamily:"'Figtree',sans-serif",fontSize:11.5,fontWeight:700,color:"#fff",letterSpacing:".06em",textTransform:"uppercase",textDecoration:"none",border:"1px solid #B8102A",padding:"6px 16px",transition:"background .18s",background:"#B8102A" }}
          onMouseEnter={e=>e.currentTarget.style.background="#8A0D20"}
          onMouseLeave={e=>e.currentTarget.style.background="#B8102A"}>
          Apply to Mentor →
        </a>
      </div>
    </div>
    <div style={{ background:"#fff",borderBottom:"1px solid var(--brd)",position:"sticky",top:68,zIndex:100 }}>
      <div style={{ maxWidth:1160,margin:"0 auto",padding:"0 44px",display:"flex",overflowX:"auto" }}>
        {TABS.map(([id,label]) => <button key={id} className={`tab-b ${tab===id?"on":""}`} onClick={() => { setTab(id); if(id==="apply") setStep(1); }}>{label}</button>)}
      </div>
    </div>

    {tab==="overview" && (
      <Sec bg="#fff">
        {/* Description */}
        <div className="g2" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,marginBottom:64 }}>
          <div className="reveal">
            <Ey label="About the Programme"/>
            <H2 s={{ marginBottom:20 }}>Fellowship Overview</H2>
            <Txt s={{ marginBottom:14 }}>AIxBio Africa is an independent research organisation advancing research at the intersection of artificial intelligence, biosecurity, health, governance, and societal resilience in African contexts.</Txt>
            <Txt s={{ marginBottom:14 }}>The AIxBio Africa Research Fellowship is a 5-week remote research program for aspiring and early-career researchers interested in producing rigorous, impactful work on AI, biosecurity, health systems, governance, and related societal challenges in Africa.</Txt>
            <Txt muted s={{ marginBottom:28,fontSize:14.5 }}>Fellows will pursue independent research projects aligned with AIxBio Africa's mission and produce a substantial research output suitable for publication. Fellow applications for this cohort are now closed.</Txt>
            <button className="br" onClick={() => setTab("mentors")}>Explore Mentor Applications →</button>
          </div>

          {/* Fellowship Details */}
          <div className="reveal d2">
            <div style={{ background:"#F7F6F2",border:"1px solid var(--brd)",padding:"28px 26px",marginBottom:16 }}>
              <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10.5,fontWeight:700,color:"#5A5956",letterSpacing:".14em",textTransform:"uppercase",marginBottom:18 }}>Fellowship Details</div>
              {[["Duration","5 Weeks"],["Format","Remote"],["Cohort Size","4 Fellows"],["Cost","Free"],["Stipend","None (Pilot Cohort)"]].map(([k,v])=>(
                <div key={k} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:"1px solid var(--brd)" }}>
                  <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:13.5,color:"#5A5956" }}>{k}</span>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:600,color:"#1A1917" }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Key features */}
            {[["Research-focused","Participants develop practical research skills through guided independent inquiry, not passive instruction."],
              ["Interdisciplinary","The programme welcomes backgrounds across life sciences, technology, policy, and social sciences."],
              ["No cost to participants","The programme is offered at no charge to all accepted fellows."],
              ["Substantial output","Fellows produce a real research artifact — preprint, report, or policy paper — by the end of the programme."]
            ].map(([t,d],i)=>(
              <div key={t} className={`reveal d${i+1}`} style={{ display:"flex",gap:16,padding:"18px 0",borderBottom:i<3?"1px solid var(--brd)":"none" }}>
                <div style={{ width:7,height:7,borderRadius:"50%",background:"#B8102A",marginTop:8,flexShrink:0 }}/>
                <div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:600,color:"#1A1917",marginBottom:4 }}>{t}</div>
                  <Txt muted s={{ fontSize:14 }}>{d}</Txt>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Cohort */}
        <CurrentCohort/>

        {/* Research Areas */}
        <div className="reveal" style={{ marginBottom:56 }}>
          <Ey label="Research Areas"/>
          <H2 s={{ marginBottom:32 }}>Areas of Focus</H2>
          <div className="g3" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16 }}>
            {[["AI and Biosecurity","tr"],["AI and Health Systems","tb"],["AI Governance and Policy","ta"],["AI Safety and Evaluation","tr"],["Public Health and Emerging Technologies","tg"],["Societal Impacts of AI in Africa","tl"]].map(([area,tc],i)=>(
              <div key={area} className={`reveal d${i+1}`} style={{ padding:"20px 22px",background:"#F7F6F2",border:"1px solid var(--brd)" }}>
                <span className={`tag ${tc}`} style={{ marginBottom:10,display:"inline-block" }}>Research Area</span>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:"#1A1917",lineHeight:1.3 }}>{area}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Expected Outputs */}
        <div className="reveal" style={{ marginBottom:56 }}>
          <Ey label="Expected Outputs"/>
          <H2 s={{ marginBottom:20 }}>What Fellows Produce</H2>
          <Txt s={{ marginBottom:24 }}>By the end of the fellowship, fellows should produce one of the following:</Txt>
          <div className="g2" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            {[["Research Report","A structured investigation of a defined research question with methodology, findings, and recommendations."],
              ["Preprint","A research paper submitted to a preprint server (e.g. SSRN, OSF, bioRxiv) for open access."],
              ["Conference Paper Submission","A paper submitted for consideration at a relevant academic conference or workshop."],
              ["Policy Research Paper","A policy-oriented document presenting evidence-based recommendations to relevant stakeholders."]
            ].map(([t,d],i)=>(
              <div key={t} style={{ display:"flex",gap:16,padding:"20px 22px",border:"1px solid var(--brd)",background:"#fff" }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:13,fontWeight:700,color:"rgba(184,16,42,.4)",paddingTop:2,flexShrink:0 }}>{String(i+1).padStart(2,"0")}</div>
                <div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:"#1A1917",marginBottom:6 }}>{t}</div>
                  <Txt muted s={{ fontSize:13.5,lineHeight:1.6 }}>{d}</Txt>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="reveal">
          <Ey label="Timeline"/>
          <H2 s={{ marginBottom:28 }}>Key Dates</H2>
          <div style={{ display:"flex",flexDirection:"column",gap:0 }}>
            {[["Fellow Applications","Closed 3 July 2026","tl"],["Decisions Released","July 2026","tb"],["Fellowship Begins","July 2026","ta"],["Mentor Applications","Open Now","tg"]].map(([event,date,tc],i,arr)=>(
              <div key={event} style={{ display:"flex",alignItems:"center",gap:24,padding:"18px 0",borderBottom:i<arr.length-1?"1px solid var(--brd)":"none" }}>
                <div style={{ display:"flex",alignItems:"center",gap:14,flex:1 }}>
                  <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:0 }}>
                    <div style={{ width:10,height:10,borderRadius:"50%",background: event==="Mentor Applications" ? "#1A7646" : "#B8102A",flexShrink:0 }}/>
                  </div>
                  <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:14.5,color:"#3A3835" }}>{event}</span>
                </div>
                <span className={`tag ${tc}`} style={{ fontSize:11,padding:"4px 12px" }}>{date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="reveal" style={{ marginTop:48,paddingTop:40,borderTop:"1px solid var(--brd)",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16 }}>
          <div>
            <h4 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600,color:"#1A1917",marginBottom:6 }}>Want to help shape this cohort?</h4>
            <Txt muted s={{ fontSize:14.5 }}>We're welcoming mentor applications now — <strong style={{ color:"#1A1917" }}>volunteer role</strong>, no deadline set.</Txt>
          </div>
          <a href="https://airtable.com/apph1o7t9K13CL84h/pag73OEGWci1TN0uN/form" target="_blank" rel="noopener noreferrer" className="br" style={{ textDecoration:"none",display:"inline-block",padding:"14px 32px",fontSize:13,letterSpacing:".05em" }}>Apply to Mentor →</a>
        </div>
      </Sec>
    )}

    {tab==="eligibility" && (
      <Sec bg="#fff">
        <div className="g2" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:72 }}>
          <div className="reveal">
            <Ey label="Who Can Apply"/><H2 s={{ marginBottom:20 }}>Eligibility</H2>
            <Txt s={{ marginBottom:16 }}>Fellow applications for the pilot cohort are now closed. Eligibility criteria below are retained for reference and for future cohorts.</Txt>
            <Txt s={{ marginBottom:28 }}>We welcome applications from a broad range of backgrounds. No prior research experience in AI safety or biosecurity is required — what matters is genuine intellectual curiosity and a commitment to producing meaningful research.</Txt>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10.5,fontWeight:700,color:"#5A5956",letterSpacing:".12em",textTransform:"uppercase",marginBottom:14 }}>We welcome applications from</div>
              {["Students","Recent Graduates","Independent Researchers","Early-Career Professionals"].map((t,i)=>(
                <div key={i} style={{ display:"flex",gap:10,padding:"10px 0",borderBottom:"1px solid var(--brd)" }}>
                  <span style={{ color:"#B8102A",fontWeight:700,flexShrink:0 }}>—</span>
                  <Txt muted s={{ fontSize:14.5,lineHeight:1.58 }}>{t}</Txt>
                </div>
              ))}
            </div>
            <Txt muted s={{ fontSize:14 }}>Applicants from outside Africa whose work is directly relevant to African AI and biosecurity contexts may be considered on a case-by-case basis.</Txt>
          </div>
          <div className="reveal d2">
            <div style={{ background:"#F7F6F2",border:"1px solid var(--brd)",padding:"28px 24px",marginBottom:16 }}>
              <h4 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:"#1A1917",marginBottom:16 }}>What we look for</h4>
              {["Genuine interest in AI, biosecurity, health systems, governance, or related societal challenges","Analytical ability and intellectual curiosity","Motivation to produce a real, publishable research output","Commitment to completing the 5-week programme","Capacity to work independently in a remote setting","Connection to or interest in African research contexts"].map((t,i)=>(
                <div key={i} style={{ display:"flex",gap:10,marginBottom:10 }}>
                  <span style={{ color:"#B8102A",fontWeight:700,marginTop:1 }}>—</span>
                  <Txt muted s={{ fontSize:14,lineHeight:1.6 }}>{t}</Txt>
                </div>
              ))}
            </div>
            <div style={{ border:"1px solid var(--brd)",padding:"20px 22px",marginBottom:20 }}>
              <h4 style={{ fontFamily:"'Figtree',sans-serif",fontSize:11,fontWeight:700,color:"#5A5956",letterSpacing:".12em",textTransform:"uppercase",marginBottom:12 }}>Selection</h4>
              <Txt muted s={{ fontSize:13.5 }}>Selection is based on demonstrated interest, motivation, analytical ability, and commitment to producing a research output. The pilot cohort is limited to 5 fellows.</Txt>
            </div>
            <button className="br" onClick={() => setTab("mentors")}>Interested in Mentoring Instead? →</button>
          </div>
        </div>
      </Sec>
    )}

    {tab==="mentors" && (
      <Sec bg="#fff">
        <div style={{ maxWidth:700 }}>
          <div className="reveal" style={{ marginBottom:32 }}>
            <Ey label="Mentors"/>
            <H2 s={{ marginBottom:20 }}>Mentor Network</H2>
            <Txt s={{ marginBottom:20 }}>With fellow applications now closed for the pilot cohort, we're turning our attention to building out the mentor network. We're inviting researchers and practitioners across AI, biosecurity, health systems, and governance to help guide fellows through their independent research projects.</Txt>
            <Txt muted s={{ fontSize:14.5 }}>This is a volunteer role — mentors are not compensated for the pilot cohort. In return, mentors join a growing interdisciplinary network at the intersection of AI and biosecurity in African contexts, and are credited as contributors to the programme.</Txt>
          </div>
          <div className="reveal" style={{ padding:"26px 28px",background:"#F7F6F2",border:"1px solid var(--brd)" }}>
            <h4 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:21,fontWeight:600,color:"#1A1917",marginBottom:12 }}>Now welcoming mentor applications</h4>
            <Txt muted s={{ fontSize:14.5,marginBottom:20 }}>If you work in biosecurity, AI, public health, veterinary science, technology governance, or a related field and are interested in supporting early-career African researchers on a volunteer basis, we'd love to hear from you.</Txt>
            <a href="https://airtable.com/apph1o7t9K13CL84h/pag73OEGWci1TN0uN/form" target="_blank" rel="noopener noreferrer" className="br" style={{ textDecoration:"none",display:"inline-block" }}>Apply to Mentor →</a>
          </div>
        </div>
      </Sec>
    )}

    {tab==="faqs" && (
      <Sec bg="#fff">
        <div className="reveal" style={{ marginBottom:48 }}><Ey label="FAQs"/><H2>Frequently Asked Questions</H2></div>
        <div style={{ maxWidth:720 }}>
          {FAQS.map(({ q,a },i) => (
            <FaqItem key={i} q={q} a={a} i={i}/>
          ))}
        </div>
      </Sec>
    )}

    {tab==="apply" && (
      <Sec bg="#fff">
        <div style={{ maxWidth:620 }}>
          <Ey label="Apply"/>
          <H2 s={{ marginBottom:16 }}>Fellow Applications Are Closed</H2>
          {/* Status callout */}
          <div style={{ display:"flex",alignItems:"center",gap:10,background:"rgba(90,89,86,.06)",border:"1px solid rgba(90,89,86,.18)",padding:"12px 18px",marginBottom:28,flexWrap:"wrap" }}>
            <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:13,fontWeight:700,color:"#5A5956",letterSpacing:".04em",textTransform:"uppercase" }}>Fellow Applications</span>
            <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:"#1A1917" }}>Closed 3 July 2026</span>
          </div>
          <Txt s={{ marginBottom:14 }}>Thank you to everyone who applied to join our pilot cohort. Applications are now closed while we review submissions — decisions will be released in July 2026.</Txt>
          <Txt muted s={{ marginBottom:28 }}>In the meantime, we're welcoming applications from prospective mentors interested in supporting this cohort. It's a volunteer role open to researchers and practitioners across AI, biosecurity, health systems, and governance.</Txt>
          <a
            href="https://airtable.com/apph1o7t9K13CL84h/pag73OEGWci1TN0uN/form"
            target="_blank"
            rel="noopener noreferrer"
            className="br"
            style={{ textDecoration:"none",display:"inline-block",padding:"14px 36px",fontSize:13,letterSpacing:".05em",marginBottom:16 }}
          >
            Apply to Mentor →
          </a>
          <p style={{ fontFamily:"'Figtree',sans-serif",fontSize:12.5,color:"#9A9896",lineHeight:1.6 }}>
            Questions about your fellowship application? Contact us at <span style={{ color:"#1A1917" }}>contact@aixbio.africa</span>
          </p>
        </div>
      </Sec>
    )}

    {/* Contact CTA strip */}
    <Sec bg="#F7F6F2" style={{ padding:"44px 44px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16 }}>
        <div>
          <h4 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:"#1A1917",marginBottom:4 }}>Questions about the fellowship or mentoring?</h4>
          <Txt muted s={{ fontSize:14.5 }}>We respond to fellowship and mentor questions within 3–5 working days.</Txt>
        </div>
        <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
          <a href="https://airtable.com/apph1o7t9K13CL84h/pag73OEGWci1TN0uN/form" target="_blank" rel="noopener noreferrer" className="br" style={{ textDecoration:"none",display:"inline-block",flexShrink:0 }}>Apply to Mentor →</a>
          <button className="bo" style={{ flexShrink:0 }} onClick={()=>go("contact")}>Contact Us</button>
        </div>
      </div>
    </Sec>
  </>);
};

/* ══════════ MENTORS PAGE ════════════════════════════ */

const MentorCard = ({ name, role, img, bio }) => (
  <div className="reveal lft" style={{ background:"#fff",border:"1px solid var(--brd)",padding:"28px 26px",display:"flex",gap:24,alignItems:"flex-start",flexWrap:"wrap" }}>
    <img src={img} alt={name} style={{ width:92,height:92,borderRadius:"50%",objectFit:"cover",flexShrink:0,border:"1px solid var(--brd)" }}/>
    <div style={{ flex:1,minWidth:220 }}>
      <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:21,fontWeight:600,color:"#1A1917",marginBottom:6 }}>{name}</h3>
      <span className="tag tr" style={{ marginBottom:14,display:"inline-block" }}>{role}</span>
      <Txt muted s={{ fontSize:14,lineHeight:1.7 }}>{bio}</Txt>
    </div>
  </div>
);

const MentorsPage = ({ go }) => (<>
  <PageHdr label="Mentors" title="Mentor Network" sub="Meet the mentors guiding fellows through the AIxBio Africa Pilot Cohort 2026, and learn how to join our growing mentor network."/>
  <Sec bg="#fff">
    <div style={{ marginBottom:56 }}>
      <Ey label="Pilot Cohort 2026"/>
      <H2 s={{ marginBottom:18 }}>Mentors for Pilot Cohort 2026</H2>
      <Txt muted s={{ marginBottom:32,maxWidth:700 }}>Our pilot cohort fellows are guided by mentors across technical, policy, and governance domains, each bringing deep expertise to help fellows shape and strengthen their research.</Txt>
      <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
        {MENTORS.map(m => <MentorCard key={m.name} {...m}/>)}
      </div>
    </div>

    <div style={{ maxWidth:700 }}>
      <Txt s={{ marginBottom:18 }}>Beyond the pilot cohort, we're building out a wider mentor network. We're inviting researchers and practitioners working in biosecurity, artificial intelligence, public health, veterinary science, policy, and related fields to help guide future fellows through their independent research projects.</Txt>
      <Txt muted s={{ marginBottom:48 }}>This is a volunteer role — mentors are not compensated for the pilot cohort. In return, mentors join a growing interdisciplinary network at the intersection of AI and biosecurity in African contexts, and are credited as contributors to the programme.</Txt>

      <div className="reveal" style={{ padding:"28px 30px",background:"#F7F6F2",border:"1px solid var(--brd)" }}>
        <h4 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:"#1A1917",marginBottom:12 }}>Now welcoming mentor applications</h4>
        <Txt muted s={{ fontSize:14.5,marginBottom:20 }}>If you work in biosecurity, AI, public health, veterinary science, technology governance, or a related field and are interested in supporting early-career African researchers on a volunteer basis, we'd love to hear from you.</Txt>
        <a href="https://airtable.com/apph1o7t9K13CL84h/pag73OEGWci1TN0uN/form" target="_blank" rel="noopener noreferrer" className="br" style={{ textDecoration:"none",display:"inline-block" }}>Apply to Mentor →</a>
      </div>
    </div>
  </Sec>
</>);

/* ══════════ FOUNDING TEAM PAGE ══════════════════════ */

const TeamPage = ({ go }) => (<>
  <PageHdr label="Join Our Founding Team" title="Help Build AIxBio Africa" sub="We're assembling a small founding team of passionate individuals who want to help build AIxBio Africa from the ground up."/>

  <Sec bg="#fff">
    <div className="g2" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,alignItems:"start",marginBottom:56 }}>
      <div className="reveal">
        <Txt s={{ marginBottom:16 }}>These are volunteer founding team opportunities for people excited about creating meaningful impact through AI safety, biosecurity, and scientific capacity in Africa. If you're looking to take ownership, contribute your skills, and grow alongside an ambitious organization, we'd love to hear from you.</Txt>
        <Txt muted s={{ marginBottom:28 }}>As AIxBio Africa grows and secures funding, we intend to prioritize outstanding founding team members for future funded opportunities where suitable roles and funding become available. While we cannot guarantee future paid positions, we're committed to growing with the people who help build this organization.</Txt>
        <a href={TEAM_APPLY_URL} target="_blank" rel="noopener noreferrer" className="br" style={{ textDecoration:"none",display:"inline-block",padding:"14px 32px",fontSize:13,letterSpacing:".05em" }}>Apply Now →</a>
      </div>
      <div>
        <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10.5,fontWeight:700,color:"#5A5956",letterSpacing:".12em",textTransform:"uppercase",marginBottom:16 }}>Why We're Building a Founding Team</div>
        <Txt s={{ marginBottom:14 }}>Every impactful organization begins with a small group of people who believe in the mission and are willing to help build it.</Txt>
        <Txt s={{ marginBottom:14 }}>As AIxBio Africa grows, we're looking for people who want to contribute beyond volunteering for isolated tasks. We're looking for collaborators who are excited about shaping programs, building systems, creating partnerships, supporting our community, and helping define what AIxBio Africa becomes.</Txt>
        <Txt muted>If you're excited by the challenge of building something meaningful from the beginning, this is an opportunity to make a lasting contribution.</Txt>
      </div>
    </div>

    {/* What it means to be a founding team member */}
    <div className="reveal" style={{ marginBottom:56 }}>
      <Ey label="What It Means"/>
      <H2 s={{ marginBottom:20 }}>Being a Founding Team Member</H2>
      <Txt s={{ marginBottom:24 }}>Being part of the founding team means taking ownership of meaningful work while helping shape the future of AIxBio Africa. As a founding team member, you'll have the opportunity to:</Txt>
      <div className="g2" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        {FOUNDING_BENEFITS.map((b,i) => (
          <div key={i} style={{ display:"flex",gap:12,padding:"16px 18px",background:"#F7F6F2",border:"1px solid var(--brd)" }}>
            <span style={{ color:"#B8102A",fontWeight:700,flexShrink:0 }}>—</span>
            <Txt muted s={{ fontSize:14,lineHeight:1.6 }}>{b}</Txt>
          </div>
        ))}
      </div>
    </div>

    {/* Current opportunities */}
    <div className="reveal" style={{ marginBottom:56 }}>
      <Ey label="Current Opportunities"/>
      <H2 s={{ marginBottom:32 }}>Founding Team Roles</H2>
      <div style={{ display:"flex",flexDirection:"column" }}>
        {FOUNDING_ROLES.map((r,i) => (
          <div key={r.title} style={{ display:"grid",gridTemplateColumns:"1fr auto",gap:24,padding:"24px 0",borderTop:"1px solid var(--brd)",alignItems:"center" }}>
            <div>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:"#1A1917",marginBottom:6 }}>{r.title}</h3>
              <Txt muted s={{ fontSize:14 }}>{r.desc}</Txt>
              <span className="chip cg" style={{ marginTop:10,display:"inline-block" }}>Volunteer</span>
            </div>
            <a href={TEAM_APPLY_URL} target="_blank" rel="noopener noreferrer" className="bo" style={{ textDecoration:"none",whiteSpace:"nowrap" }}>Apply →</a>
          </div>
        ))}
        <div style={{ borderTop:"1px solid var(--brd)" }}/>
      </div>
    </div>

    {/* Who we're looking for */}
    <div className="reveal" style={{ marginBottom:56 }}>
      <Ey label="Who We're Looking For"/>
      <H2 s={{ marginBottom:20 }}>Fit Over Résumé</H2>
      <Txt s={{ marginBottom:24 }}>We care more about your commitment, initiative, and willingness to learn than checking every box on a job description. We're looking for people who are:</Txt>
      <div className="g2" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        {["Passionate about meaningful impact.","Proactive and reliable.","Comfortable working in a remote environment.","Strong communicators and team players.","Excited to help build an organization from the ground up."].map((t,i)=>(
          <div key={i} style={{ display:"flex",gap:10,padding:"14px 0" }}>
            <span style={{ color:"#B8102A",fontWeight:700,flexShrink:0 }}>—</span>
            <Txt muted s={{ fontSize:14.5,lineHeight:1.58 }}>{t}</Txt>
          </div>
        ))}
      </div>
    </div>

    {/* Commitment */}
    <div className="reveal" style={{ marginBottom:56 }}>
      <Ey label="Commitment"/>
      <H2 s={{ marginBottom:20 }}>Time &amp; Structure</H2>
      <div style={{ display:"flex",gap:18,padding:"22px 24px",background:"#F7F6F2",border:"1px solid var(--brd)",marginBottom:16,flexWrap:"wrap" }}>
        <div>
          <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10,fontWeight:700,color:"#B8102A",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4 }}>Time Commitment</div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:"#1A1917" }}>5–10 hours per week</div>
        </div>
      </div>
      <Txt muted s={{ fontSize:14.5 }}>These are volunteer founding team positions. We understand that everyone has different schedules, but we're looking for people who can contribute consistently and take ownership of their responsibilities.</Txt>
    </div>

    {/* Why join */}
    <div className="reveal" style={{ marginBottom:56 }}>
      <Ey label="Why Join?"/>
      <H2 s={{ marginBottom:20 }}>A Unique Opportunity</H2>
      <Txt s={{ marginBottom:24 }}>Joining AIxBio Africa at this stage offers a unique opportunity to help shape an organization from its earliest days. As a founding team member, you'll have the opportunity to:</Txt>
      <div className="g2" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        {["Make a meaningful contribution to an emerging nonprofit.","Work directly with the organization's leadership.","Build leadership and project management experience.","Expand your professional network.","Collaborate with experts, mentors, and researchers.","Grow alongside the organization and be considered for future funded opportunities where available."].map((t,i)=>(
          <div key={i} style={{ display:"flex",gap:10,padding:"14px 0" }}>
            <span style={{ color:"#B8102A",fontWeight:700,flexShrink:0 }}>—</span>
            <Txt muted s={{ fontSize:14.5,lineHeight:1.58 }}>{t}</Txt>
          </div>
        ))}
      </div>
    </div>

    {/* Application process */}
    <div className="reveal" style={{ marginBottom:56 }}>
      <Ey label="Application Process"/>
      <H2 s={{ marginBottom:28 }}>How to Apply</H2>
      <div style={{ display:"flex",flexDirection:"column",gap:0 }}>
        {["Submit your application.","Applications are reviewed on a rolling basis.","Shortlisted applicants will be invited for an interview.","Successful applicants will join the AIxBio Africa Founding Team."].map((step,i,arr) => (
          <div key={i} style={{ display:"flex",alignItems:"center",gap:18,padding:"16px 0",borderBottom:i<arr.length-1?"1px solid var(--brd)":"none" }}>
            <div className="step-dot" style={{ background:"rgba(184,16,42,.09)",color:"#B8102A" }}>{i+1}</div>
            <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:14.5,color:"#3A3835" }}>{step}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Closing CTA */}
    <div className="reveal" style={{ textAlign:"center",padding:"48px 24px",background:"#1C1B18" }}>
      <p style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:19,color:"rgba(255,255,255,.6)",marginBottom:6 }}>Every organization starts somewhere.</p>
      <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:600,color:"#fff",marginBottom:22 }}>This is ours.</h3>
      <Txt s={{ color:"rgba(255,255,255,.55)",marginBottom:26,maxWidth:480,marginLeft:"auto",marginRight:"auto" }}>If you're excited about helping build AIxBio Africa and contributing to our mission, we'd love to hear from you.</Txt>
      <a href={TEAM_APPLY_URL} target="_blank" rel="noopener noreferrer" className="br" style={{ textDecoration:"none",display:"inline-block",padding:"14px 34px",fontSize:13,letterSpacing:".05em" }}>Apply to Join Our Founding Team →</a>
    </div>
  </Sec>
</>);

/* ══════════ FAQ ITEM ════════════════════════════════ */

const FaqItem = ({ q,a }) => {
  const [open,setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button onClick={()=>setOpen(o=>!o)} style={{ width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",background:"none",border:"none",cursor:"pointer",padding:"4px 0",gap:16 }}>
        <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:"#1A1917",lineHeight:1.3,textAlign:"left" }}>{q}</span>
        <span style={{ color:"#B8102A",fontSize:18,flexShrink:0,transition:"transform .2s",transform: open?"rotate(45deg)":"rotate(0)" }}>+</span>
      </button>
      {open && <Txt muted s={{ marginTop:12,fontSize:14.5 }}>{a}</Txt>}
    </div>
  );
};

/* ══════════ BLOG PAGES ══════════════════════════════ */

const BlogPage = ({ go }) => {
  const [q,setQ]=useState(""); const [cat,setCat]=useState("All");
  const cats = ["All",...Array.from(new Set(BLOG.map(b=>b.cat)))];
  const filtered = BLOG.filter(b=>{
    const m=(b.title+b.excerpt).toLowerCase().includes(q.toLowerCase());
    return m && (cat==="All"||b.cat===cat);
  });

  /* Re-observe any new .reveal elements after filter state changes */
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } }),
      { threshold: 0.05, rootMargin: "0px 0px -16px 0px" }
    );
    const t = setTimeout(() => document.querySelectorAll(".reveal:not(.in)").forEach(el => obs.observe(el)), 60);
    return () => { obs.disconnect(); clearTimeout(t); };
  }, [q, cat]);
  return (<>
    <PageHdr label="Insights" title="Insights &amp; Analysis"/>
    <Sec bg="#fff">
      <div style={{ display:"flex",gap:14,marginBottom:40,flexWrap:"wrap" }}>
        <input placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)} style={{ maxWidth:260,padding:"9px 14px",fontSize:13.5 }}/>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {cats.map(c=><button key={c} onClick={()=>setCat(c)} style={{ fontFamily:"'Figtree',sans-serif",fontSize:11.5,fontWeight:600,letterSpacing:".04em",textTransform:"uppercase",padding:"8px 16px",cursor:"pointer",background:cat===c?"#B8102A":"transparent",color:cat===c?"#fff":"#5A5956",border:cat===c?"1px solid #B8102A":"1px solid var(--brd)",transition:"all .18s",borderRadius:0 }}>{c}</button>)}
        </div>
      </div>
      {filtered.length===0 ? <Txt muted>No posts match your search.</Txt> : (
        <div className="g3" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20 }}>
          {filtered.map(({ slug,cat,tc,date,rt,title,excerpt },i)=>(
            <div key={slug} className="lft" onClick={()=>go("blog-post",{slug})} style={{ background:"#F7F6F2",border:"1px solid var(--brd)",padding:"26px 22px",cursor:"pointer",display:"flex",flexDirection:"column",gap:12 }}>
              <span className={`tag ${tc}`}>{cat}</span>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:600,color:"#1A1917",lineHeight:1.34,flex:1 }}>{title}</h3>
              <Txt muted s={{ fontSize:13.5 }}>{excerpt}</Txt>
              <div style={{ borderTop:"1px solid var(--brd)",paddingTop:12,display:"flex",justifyContent:"space-between" }}>
                <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:11.5,color:"#9A9896" }}>{date} · {rt}</span>
                <span style={{ color:"#B8102A",fontWeight:600 }}>→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Sec>
  </>);
};

const BlogPost = ({ slug,go }) => {
  const post = BLOG.find(b=>b.slug===slug);
  if (!post) return <Sec><Txt>Post not found.</Txt></Sec>;
  return (<>
    <PageHdr label={post.cat} title={post.title} sub={`${post.date} · ${post.rt}`}/>
    <Sec bg="#fff">
      <div style={{ display:"grid",gridTemplateColumns:"1fr 280px",gap:56 }} className="g2r">
        <article>
          {post.body.split("\n\n").map((p,i)=><Txt key={i} s={{ marginBottom:20 }}>{p}</Txt>)}
          <div style={{ marginTop:40,paddingTop:28,borderTop:"1px solid var(--brd)" }}>
            <button className="bo" onClick={()=>go("blog")}>← All Posts</button>
          </div>
        </article>
        <aside>
          <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10.5,fontWeight:700,color:"#5A5956",letterSpacing:".12em",textTransform:"uppercase",marginBottom:16 }}>More Posts</div>
          {BLOG.filter(b=>b.slug!==slug).slice(0,3).map(b=>(
            <div key={b.slug} onClick={()=>go("blog-post",{slug:b.slug})} style={{ borderBottom:"1px solid var(--brd)",paddingBottom:14,marginBottom:14,cursor:"pointer" }}>
              <span className={`tag ${b.tc}`} style={{ marginBottom:7,display:"inline-block" }}>{b.cat}</span>
              <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:600,color:"#1A1917",lineHeight:1.3 }}>{b.title}</div>
              <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:11.5,color:"#9A9896",marginTop:4 }}>{b.date}</div>
            </div>
          ))}
        </aside>
      </div>
    </Sec>
  </>);
};

/* ══════════ CONTACT / SUPPORT PAGES ════════════════ */

const ContactPage = ({ go, addContact }) => {
  const [f,setF]=useState({name:"",email:"",org:"",msg:"",hp:""}); const [e,setE]=useState({}); const [sub,setSub]=useState(false); const [done,setDone]=useState(false);
  const upd=k=>ev=>setF(fd=>({...fd,[k]:ev.target.value}));
  const validate=()=>{const er={};if(!f.name.trim())er.name="Required";if(!f.email.includes("@"))er.email="Valid email required";if(f.msg.trim().length<20)er.msg="Please write a message";return er;};
  const submit=()=>{if(f.hp)return;const er=validate();if(Object.keys(er).length){setE(er);return;}setSub(true);setTimeout(()=>{addContact(f);setDone(true);setSub(false);},700);};
  return (<>
    <PageHdr label="Contact" title="Get in Touch"/>
    <Sec bg="#fff">
      {done ? (
        <div style={{ maxWidth:440,margin:"0 auto",textAlign:"center",padding:"40px 0" }}>
          <div style={{ width:44,height:44,borderRadius:"50%",background:"rgba(26,118,70,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",fontSize:20 }}>✓</div>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,color:"#1A1917",marginBottom:10 }}>Message Received</h3>
          <Txt muted s={{ marginBottom:22 }}>Thank you. We will respond within 3–5 working days.</Txt>
          <button className="bo" onClick={()=>go("home")}>Return Home</button>
        </div>
      ) : (
        <div className="g2" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:60 }}>
          <div>
            <FF label="Name" error={e.name}><input value={f.name} onChange={upd("name")} placeholder="Your name"/></FF>
            <FF label="Email" error={e.email}><input type="email" value={f.email} onChange={upd("email")} placeholder="your@email.com"/></FF>
            <FF label="Organization (optional)"><input value={f.org} onChange={upd("org")} placeholder="Institution or affiliation"/></FF>
            <FF label="Message" error={e.msg}><textarea value={f.msg} onChange={upd("msg")} placeholder="How can we help?" style={{ minHeight:120 }}/></FF>
            <input value={f.hp} onChange={upd("hp")} style={{ display:"none" }} tabIndex={-1} aria-hidden="true"/>
            <button className="br" onClick={submit} disabled={sub} style={{ width:"100%",padding:"13px" }}>{sub?"Sending…":"Send Message →"}</button>
          </div>
          <div>
            <div style={{ background:"#F7F6F2",padding:"24px",border:"1px solid var(--brd)",marginBottom:14 }}>
              <h4 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:"#1A1917",marginBottom:14 }}>We respond to</h4>
              {["Research collaborations and joint projects","Fellowship and programme questions","Media and press inquiries","General questions about our work"].map((t,i)=>(
                <div key={i} style={{ display:"flex",gap:8,marginBottom:9 }}>
                  <span style={{ color:"#B8102A",fontWeight:700,marginTop:1 }}>—</span>
                  <Txt muted s={{ fontSize:14,lineHeight:1.58 }}>{t}</Txt>
                </div>
              ))}
            </div>
            <div style={{ border:"1px solid var(--brd)",padding:"20px 22px" }}>
              {[["Email","contact@aixbio.africa"],["LinkedIn","AIxbio Africa"]].map(([k,v])=>(
                <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid var(--brd)" }}>
                  <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:13,color:"#5A5956" }}>{k}</span>
                  <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:13,color:"#1A1917",fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Sec>
  </>);
};

const CollaboratePage = ({ go }) => (<>
  <PageHdr label="Collaborate" title="Research Collaboration"/>
  <Sec bg="#fff">
    <div className="g2" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:72 }}>
      <div className="reveal">
        <Ey label="Work with us"/>
        <H2 s={{ marginBottom:20 }}>We welcome serious collaboration</H2>
        <Txt s={{ marginBottom:16 }}>AIxbio Africa is actively building a network of research collaborators across African universities, international biosecurity institutions, and AI safety organisations.</Txt>
        <Txt muted s={{ marginBottom:28 }}>If you are interested in joint research, co-authorship, dataset sharing, or any form of substantive collaboration, please use the contact form to reach us with a brief description of your interests.</Txt>
        <button className="br" onClick={()=>go("contact")}>Contact Us →</button>
      </div>
      <div>
        {[["Research institutions","Joint projects, co-authorship, and data sharing with African universities and research institutes."],["AI organisations","Collaboration with AI labs and safety organisations on evaluation methodology and model testing."],["Funders","We welcome conversations with funders aligned with our research agenda."],["Policy bodies","Engagement with African governments, the Africa CDC, and international health organisations."]].map(([t,d],i)=>(
          <div key={t} className={`reveal d${i+1}`} style={{ padding:"18px 0",borderBottom:i<3?"1px solid var(--brd)":"none" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:600,color:"#1A1917",marginBottom:5 }}>{t}</div>
            <Txt muted s={{ fontSize:14 }}>{d}</Txt>
          </div>
        ))}
      </div>
    </div>
  </Sec>
</>);

const DonatePage = ({ go }) => (<>
  <PageHdr label="Donate" title="Support AIxbio Africa"/>
  <Sec bg="#fff">
    <div style={{ maxWidth:640 }}>
      <Txt s={{ marginBottom:18 }}>AIxbio Africa is currently funded through research grants and institutional support. We are developing a formal process for individual and organisational donations.</Txt>
      <Txt muted s={{ marginBottom:28 }}>If you are interested in supporting our work financially, please contact us directly. We can discuss unrestricted support, project-specific funding, or fellowship programme sponsorship.</Txt>
      <div style={{ background:"#F7F6F2",border:"1px solid var(--brd)",padding:"24px",marginBottom:28 }}>
        <h4 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:"#1A1917",marginBottom:12 }}>Funding priorities</h4>
        {["Fellowship programme costs, including operational and access support for accepted fellows",
          "Research infrastructure and API access for evaluation work",
          "Travel support for field research and conference participation",
          "Open-access publication of research findings"].map((t,i)=>(
          <div key={i} style={{ display:"flex",gap:8,marginBottom:9 }}>
            <span style={{ color:"#B8102A",fontWeight:700,marginTop:1 }}>—</span>
            <Txt muted s={{ fontSize:14,lineHeight:1.6 }}>{t}</Txt>
          </div>
        ))}
      </div>
      <button className="br" onClick={()=>go("contact")}>Get in Touch to Discuss Support →</button>
    </div>
  </Sec>
</>);

/* ══════════ COURSES PAGE ════════════════════════════ */

const CoursesPage = () => (
  <div className="pat-dk" style={{ minHeight:"100vh",background:"#1C1B18",display:"flex",alignItems:"center",justifyContent:"center",padding:"100px 24px 40px" }}>
    <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(34px,5vw,64px)",fontWeight:600,color:"#fff",lineHeight:1.1,textAlign:"center" }}>Coming soon.</h1>
  </div>
);

/* ══════════ STUB PAGES ══════════════════════════════ */

const StubPage = ({ label,title,sub,go }) => (<>
  <PageHdr label={label} title={title} sub={sub||"This section is being developed."}/>
  <Sec bg="#fff">
    <div style={{ maxWidth:560 }}>
      <Txt muted s={{ marginBottom:28 }}>This section is in development. Check back soon, or sign up for our newsletter to be notified of updates.</Txt>
      <div style={{ display:"flex",gap:12 }}>
        <button className="br" onClick={()=>go("blog")}>Read Our Insights</button>
        <button className="bo" onClick={()=>go("contact")}>Contact Us</button>
      </div>
    </div>
  </Sec>
</>);

const FaqsPage = ({ go }) => (<>
  <PageHdr label="FAQs" title="Frequently Asked Questions"/>
  <Sec bg="#fff"><div style={{ maxWidth:720 }}>{FAQS.map((f,i)=><FaqItem key={i} {...f}/>)}</div></Sec>
</>);

/* ══════════ ADMIN ═══════════════════════════════════ */

const AdminLogin = ({ setAuth }) => {
  const [pw,setPw]=useState(""); const [err,setErr]=useState(false);
  const go=()=>{if(pw==="admin2026"){setAuth(true);setErr(false);}else setErr(true);};
  return (
    <div style={{ minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"80px 44px" }}>
      <div style={{ width:"100%",maxWidth:360,padding:"36px 32px",border:"1px solid var(--brd)",background:"#fff" }}>
        <AfricaSvg style={{ width:26,height:30,color:"#B8102A",marginBottom:14 }}/>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600,color:"#1A1917",marginBottom:6 }}>Admin Access</h2>
        <Txt muted s={{ fontSize:14,marginBottom:22 }}>AIxbio Africa internal dashboard.</Txt>
        <FF label="Password" error={err?"Incorrect password":null}>
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="Enter password"/>
        </FF>
        <button className="br" onClick={go} style={{ width:"100%",marginTop:4 }}>Sign In</button>
      </div>
    </div>
  );
};

const AdminPage = ({ apps,contacts,subs,auth,setAuth }) => {
  const [tab,setTab]=useState("overview");
  if (!auth) return <AdminLogin setAuth={setAuth}/>;
  return (<>
    <div style={{ background:"#1C1B18",padding:"128px 44px 0" }}>
      <div style={{ maxWidth:1160,margin:"0 auto" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end" }}>
          <div><Ey label="Admin"/><h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(26px,3vw,40px)",fontWeight:600,color:"#fff" }}>Dashboard</h1></div>
          <button className="nb" style={{ color:"rgba(255,255,255,.35)",fontSize:12,marginBottom:4 }} onClick={()=>setAuth(false)}>Sign out</button>
        </div>
        <div style={{ display:"flex",marginTop:24,borderBottom:"1px solid rgba(255,255,255,.08)" }}>
          {[["overview","Overview"],["applications","Applications"],["contacts","Messages"],["newsletter","Newsletter"]].map(([id,l])=>(
            <button key={id} className="nb" onClick={()=>setTab(id)} style={{ color:tab===id?"#fff":"rgba(255,255,255,.38)",borderBottom:tab===id?"2px solid #B8102A":"2px solid transparent",padding:"11px 18px",fontSize:13,fontWeight:tab===id?600:400,marginBottom:-1 }}>{l}</button>
          ))}
        </div>
      </div>
    </div>
    <Sec bg="#fff">
      {tab==="overview" && (
        <div>
          <div className="sg" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:36 }}>
            {[["Applications",apps.length],["Messages",contacts.length],["Subscribers",subs.length],["Blog Posts",BLOG.length]].map(([l,n])=>(
              <div key={l} style={{ background:"#F7F6F2",padding:"20px",border:"1px solid var(--brd)" }}>
                <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10,fontWeight:700,color:"#5A5956",letterSpacing:".12em",textTransform:"uppercase",marginBottom:8 }}>{l}</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:700,color:"#1A1917" }}>{n}</div>
              </div>
            ))}
          </div>
          <div className="g2r" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 }}>
            {[["Recent Applications",apps,"name","email","country"],["Recent Messages",contacts,"name","email","msg"]].map(([title,data,...keys])=>(
              <div key={title} style={{ border:"1px solid var(--brd)",padding:"22px" }}>
                <h4 style={{ fontFamily:"'Figtree',sans-serif",fontSize:11,fontWeight:700,color:"#5A5956",letterSpacing:".12em",textTransform:"uppercase",marginBottom:16 }}>{title}</h4>
                {data.length===0 ? <Txt muted s={{ fontSize:13.5 }}>None yet.</Txt> : data.slice(-3).reverse().map(item=>(
                  <div key={item.id} style={{ borderBottom:"1px solid var(--brd)",paddingBottom:11,marginBottom:11 }}>
                    <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:14,fontWeight:600,color:"#1A1917" }}>{item[keys[0]]}</div>
                    <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:12,color:"#5A5956" }}>{item[keys[1]]}</div>
                    {item[keys[2]] && <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:12.5,color:"#3A3835",marginTop:3 }}>{String(item[keys[2]]).slice(0,70)}{String(item[keys[2]]).length>70?"…":""}</div>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==="applications" && (
        <div>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22 }}>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600 }}>Fellowship Expressions of Interest</h3>
            <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:13,color:"#5A5956" }}>{apps.length} total</span>
          </div>
          {apps.length===0 ? <div style={{ padding:"44px 28px",border:"1px solid var(--brd)",textAlign:"center" }}><Txt muted>No applications yet.</Txt></div> : (
            <div style={{ overflowX:"auto" }}>
              <table><thead><tr><th>Name</th><th>Email</th><th>Country</th><th>Stage</th><th>Area</th><th>Date</th></tr></thead>
              <tbody>{apps.map(a=><tr key={a.id}><td style={{ fontWeight:600 }}>{a.name}</td><td>{a.email}</td><td>{a.country}</td><td><span className="chip cp">{a.stage}</span></td><td style={{ maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{a.area}</td><td style={{ color:"#9A9896" }}>{a.date}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {tab==="contacts" && (
        <div>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22 }}>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600 }}>Contact Messages</h3>
            <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:13,color:"#5A5956" }}>{contacts.length} total</span>
          </div>
          {contacts.length===0 ? <div style={{ padding:"44px 28px",border:"1px solid var(--brd)",textAlign:"center" }}><Txt muted>No messages yet.</Txt></div> : contacts.map(c=>(
            <div key={c.id} style={{ border:"1px solid var(--brd)",padding:"20px 22px",marginBottom:10 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
                <div><div style={{ fontFamily:"'Figtree',sans-serif",fontSize:14,fontWeight:600,color:"#1A1917" }}>{c.name}</div><div style={{ fontFamily:"'Figtree',sans-serif",fontSize:13,color:"#5A5956" }}>{c.email}{c.org?` · ${c.org}`:""}</div></div>
                <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:11.5,color:"#9A9896" }}>{c.date}</span>
              </div>
              <Txt muted s={{ fontSize:13.5 }}>{c.msg}</Txt>
            </div>
          ))}
        </div>
      )}
      {tab==="newsletter" && (
        <div>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22 }}>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600 }}>Newsletter Subscribers</h3>
            <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:13,color:"#5A5956" }}>{subs.length} subscribers</span>
          </div>
          {subs.length===0 ? <div style={{ padding:"44px 28px",border:"1px solid var(--brd)",textAlign:"center" }}><Txt muted>No subscribers yet.</Txt></div> : (
            <table><thead><tr><th>#</th><th>Email</th><th>Date</th></tr></thead>
            <tbody>{subs.map((s,i)=><tr key={s.id}><td style={{ color:"#9A9896" }}>{i+1}</td><td style={{ fontWeight:500 }}>{s.email}</td><td style={{ color:"#9A9896" }}>{s.date}</td></tr>)}</tbody>
            </table>
          )}
        </div>
      )}
    </Sec>
  </>);
};

/* ══════════ FOOTER ══════════════════════════════════ */

const Footer = ({ go }) => (
  <footer style={{ background:"#1C1B18",padding:"64px 44px 36px",position:"relative",overflow:"hidden" }}>
    <div style={{ position:"absolute",left:"-2%",bottom:"-6%",width:"22vw",maxWidth:300,opacity:.04,pointerEvents:"none" }}>
      <AfricaSvg style={{ width:"100%",height:"auto",color:"#fff" }}/>
    </div>
    <div style={{ maxWidth:1160,margin:"0 auto",position:"relative",zIndex:2 }}>
      <div className="fg" style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:48,marginBottom:48 }}>
        <div>
          {/* light=true so logo text is readable on dark footer background */}
          <div style={{ marginBottom:18 }}><Logo size={19} onClick={()=>go("home")} light={true}/></div>
          <p style={{ fontFamily:"'Figtree',sans-serif",fontSize:13.5,color:"rgba(255,255,255,.42)",maxWidth:252,marginBottom:22,lineHeight:1.72 }}>AIxbio Africa is an independent African research initiative focused on biosecurity, AI, and the responsible development of emerging technologies.</p>
          <div style={{ display:"flex",gap:8 }}>
            <a href="https://www.linkedin.com/company/aixbioafrica/about/?viewAsMember=true" target="_blank" rel="noopener noreferrer"
              style={{ background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.09)",color:"rgba(255,255,255,.45)",padding:"5px 11px",fontFamily:"'Figtree',sans-serif",fontSize:11,fontWeight:500,cursor:"pointer",textDecoration:"none",display:"inline-block",transition:"all .15s" }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.11)";e.currentTarget.style.color="#fff";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.06)";e.currentTarget.style.color="rgba(255,255,255,.45)";}}>
              LinkedIn
            </a>
          </div>
        </div>
        {[{t:"Research",ls:[["Research","research"],["About","about"],["Blog","blog"]]},{t:"Programs",ls:[["Fellowships","fellowship"],["Courses","courses"],["Mentors","mentors"]]},{t:"Organisation",ls:[["Team","team"],["Contact","contact"],["Collaborate","collaborate"],["Donate","donate"]]}].map(({t,ls})=>(
          <div key={t}>
            <h4 style={{ fontFamily:"'Figtree',sans-serif",fontSize:10,fontWeight:700,color:"rgba(255,255,255,.28)",letterSpacing:".17em",textTransform:"uppercase",marginBottom:16 }}>{t}</h4>
            <ul style={{ listStyle:"none",display:"flex",flexDirection:"column",gap:10 }}>
              {ls.map(([l,p])=>(
                <li key={l}><button onClick={()=>go(p)} style={{ background:"none",border:"none",fontFamily:"'Figtree',sans-serif",fontSize:13.5,color:"rgba(255,255,255,.45)",cursor:"pointer",padding:0,transition:"color .15s" }}
                  onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.45)"}>{l}</button></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop:"1px solid rgba(255,255,255,.07)",paddingTop:22,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10 }}>
        <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:12,color:"rgba(255,255,255,.22)" }}>© 2026 AIxbio Africa</span>
        <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:12,color:"rgba(255,255,255,.22)" }}>Founded by Fatika Umar Ibrahim</span>
      </div>
    </div>
  </footer>
);

/* ══════════ APP ══════════════════════════════════════ */

export default function App() {
  const pathState=useCallback(()=>{
    const path=window.location.pathname.replace(/\/+$/,"")||"/";
    const map={
      "/courses/intro-ai-biosecurity":"courses",
      "/courses/intro-ai-biosecurity/apply":"course-apply",
      "/courses/intro-ai-biosecurity/facilitator":"facilitator",
      "/courses/intro-ai-biosecurity/participant":"participant",
      "/courses/intro-ai-biosecurity/admin":"course-admin",
    };
    if(path.startsWith("/courses/intro-ai-biosecurity/facilitator/")) return {page:"facilitator-module",params:{slug:path.split("/").pop()}};
    if(path.startsWith("/courses/intro-ai-biosecurity/participant/")) return {page:"participant-module",params:{slug:path.split("/").pop()}};
    return {page:map[path]||"home",params:{}};
  },[]);

  const initial=pathState();
  const [page,setPage]=useState(initial.page); const [params,setParams]=useState(initial.params);
  const [apps,setApps]=useState([]); const [contacts,setContacts]=useState([]); const [subs,setSubs]=useState([]);
  const [session,setSession]=useState(null); const [isAdmin,setIsAdmin]=useState(false); const [authOpen,setAuthOpen]=useState(false);

  const pagePath=useCallback((p,ps={})=>{
    const base="/courses/intro-ai-biosecurity";
    if(p==="courses")return base;
    if(p==="course-apply")return `${base}/apply`;
    if(p==="facilitator")return `${base}/facilitator`;
    if(p==="facilitator-module")return `${base}/facilitator/${ps.slug}`;
    if(p==="participant")return `${base}/participant`;
    if(p==="participant-module")return `${base}/participant/${ps.slug}`;
    if(p==="course-admin")return `${base}/admin`;
    return null;
  },[]);

  const go=useCallback((p,ps={})=>{
    setPage(p);setParams(ps);
    const path=pagePath(p,ps);
    if(path) window.history.pushState({p,ps},"",path);
    else if(window.location.pathname.startsWith("/courses/intro-ai-biosecurity")) window.history.pushState({p,ps},"","/");
    setTimeout(()=>window.scrollTo({top:0,behavior:"smooth"}),0);
  },[pagePath]);

  const addSub=useCallback(email=>setSubs(s=>[...s,{email,date:new Date().toLocaleDateString("en-GB"),id:Date.now()}]),[]);
  const addApp=useCallback(d=>setApps(a=>[...a,{...d,date:new Date().toLocaleDateString("en-GB"),id:Date.now()}]),[]);
  const addContact=useCallback(d=>setContacts(c=>[...c,{...d,date:new Date().toLocaleDateString("en-GB"),id:Date.now()}]),[]);

  useEffect(()=>{
    const syncAdmin=async(nextSession)=>{
      setSession(nextSession);
      if(!nextSession?.user){setIsAdmin(false);return;}
      const {data}=await supabase.from("admins").select("user_id").eq("user_id",nextSession.user.id).maybeSingle();
      setIsAdmin(Boolean(data));
    };
    supabase.auth.getSession().then(({data})=>syncAdmin(data.session));
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,nextSession)=>{syncAdmin(nextSession);});
    return()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{
    const pop=()=>{const next=pathState();setPage(next.page);setParams(next.params);};
    window.addEventListener("popstate",pop); return()=>window.removeEventListener("popstate",pop);
  },[pathState]);

  useEffect(()=>{
    const s=document.createElement("style"); s.textContent=CSS; document.head.appendChild(s);
    return ()=>document.head.removeChild(s);
  },[]);

  useEffect(()=>{
    const obs=new IntersectionObserver(
      entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");obs.unobserve(e.target);}}),
      {threshold:.07,rootMargin:"0px 0px -16px 0px"}
    );
    const t=setTimeout(()=>document.querySelectorAll(".reveal").forEach(el=>obs.observe(el)),150);
    return ()=>{obs.disconnect();clearTimeout(t);};
  },[page]);

  const coursePages=["courses","course-apply","facilitator","facilitator-module","participant","participant-module","course-admin"];
  const signOut=async()=>{await supabase.auth.signOut();};

  return (
    <div style={{ minHeight:"100vh",fontFamily:"'Figtree',sans-serif",overflowX:"hidden",background:"#F7F6F2" }}>
      <Nav go={go} page={page} session={session} isAdmin={isAdmin} onSignIn={()=>setAuthOpen(true)} onSignOut={signOut}/>
      {page==="home"&&<HomePage go={go} addSub={addSub}/>}
      {page==="research"&&<ResearchPage go={go}/>}
      {page==="research-detail"&&<ResearchDetail slug={params.slug} go={go}/>}
      {page==="about"&&<AboutPage go={go}/>}
      {page==="fellowship"&&<FellowshipPage go={go} addApp={addApp}/>}
      {coursePages.includes(page)&&<CourseShell page={page} params={params} session={session} isAdmin={isAdmin} go={go} openAuth={()=>setAuthOpen(true)}/>}
      {page==="apply"&&<FellowshipPage go={go} addApp={addApp} startTab="apply"/>}
      {page==="mentors"&&<MentorsPage go={go}/>}
      {page==="team"&&<TeamPage go={go}/>}
      {page==="blog"&&<BlogPage go={go}/>}
      {page==="blog-post"&&<BlogPost slug={params.slug} go={go}/>}
      {page==="contact"&&<ContactPage go={go} addContact={addContact}/>}
      {page==="collaborate"&&<CollaboratePage go={go}/>}
      {page==="donate"&&<DonatePage go={go}/>}
      {page==="opportunities"&&<StubPage label="Opportunities" title="Opportunities" sub="Fellowships, grants, and collaborations will be announced here." go={go}/>}
      {page==="publications"&&<StubPage label="Publications" title="Publications &amp; Reports" go={go}/>}
      {page==="events"&&<StubPage label="Events" title="Events" go={go}/>}
      {page==="resources"&&<StubPage label="Resources" title="Resources" go={go}/>}
      {page==="policies"&&<StubPage label="Policies" title="Policies" go={go}/>}
      {page==="faqs"&&<FaqsPage go={go}/>}
      {page==="admin"&&<AdminPage apps={apps} contacts={contacts} subs={subs} auth={false} setAuth={()=>{}}/>}
      <Footer go={go}/>
      <CourseAuth open={authOpen} onClose={()=>setAuthOpen(false)}/>
    </div>
  );
}
