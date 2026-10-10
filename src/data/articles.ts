export interface ArticleItem {
  id: string
  slug: string
  title: string
  category: 'Preparing to bid' | 'Compliance' | 'Writing' | 'Pricing' | 'After the bid'
  readTime: string
  publishedDate: string
  summary: string
  content: string[]
  yoast: {
    metaTitle: string
    metaDescription: string
    focusKeyword: string
  }
}

export const SEED_ARTICLES: ArticleItem[] = [
  {
    id: 'art-1',
    slug: 'what-is-a-compliance-matrix',
    title: 'What a compliance matrix is and why evaluators read it first',
    category: 'Compliance',
    readTime: '4 min read',
    publishedDate: '4 Oct 2026',
    summary: 'Before any evaluator reads your technical approach or marvels at your project team, they verify compliance. A systematic matrix protects you against fatal administrative oversights.',
    yoast: {
      metaTitle: 'What is a Compliance Matrix in Botswana Tenders? | TenderVantage',
      metaDescription: 'Learn why Botswana tender evaluation committees read compliance matrices first and how to build one that guarantees Stage 1 administrative compliance.',
      focusKeyword: 'compliance matrix tender botswana',
    },
    content: [
      'In public procurement across Botswana, tenders do not proceed directly to technical evaluation. Under PPRA guidelines and standard local authority rules, every submission passes through Stage 1: Preliminary Examination.',
      'Preliminary examination is binary. You are either compliant or you are disqualified. There is no partial credit, no discretionary leniency, and no subjective assessment of goodwill.',
      'A compliance matrix is an exhaustive cross-reference table. In column one, you list every single mandatory returnable demanded across the Invitation to Tender (ITT), Terms of Reference, and Instruction to Bidders. In column two, you note the exact document reference, page number, and section where that returnable is located inside your submission pack.',
      'Why does this matter so deeply to an evaluation committee? Evaluators are often reviewing twenty to thirty bulky physical binders under severe time constraints. When an evaluator cannot readily locate your certified Tax Clearance Certificate or sworn declaration of non-collusion within ninety seconds, the risk of clerical disqualification rises precipitously.',
      'By placing a structured Compliance Matrix at the immediate front of your submission binder, right behind the Letter of Tender, you hand the evaluator an index map. You make it effortless for them to tick off mandatory requirements and pass your bid safely into technical scoring.',
    ],
  },
  {
    id: 'art-2',
    slug: 'seven-reasons-bids-are-disqualified-before-scoring',
    title: 'Seven reasons bids are disqualified before scoring',
    category: 'Compliance',
    readTime: '5 min read',
    publishedDate: '28 Sep 2026',
    summary: 'Every procurement cycle in Gaborone sees capable contractors eliminated before a single technical point is scored. Here are the seven fatal clerical missteps.',
    yoast: {
      metaTitle: '7 Fatal Tender Disqualification Traps in Botswana | TenderVantage',
      metaDescription: 'Avoid the seven most common administrative traps that cause Botswana contractors to be disqualified during Stage 1 tender preliminary examination.',
      focusKeyword: 'tender disqualification botswana',
    },
    content: [
      'Disqualification during preliminary examination is devastating because it has nothing to do with whether your firm can actually deliver the work. Over years of reviewing tenders across Botswana, we see the same avoidable mistakes repeated across sectors.',
      '1. Expired Tax Clearance or Non-Verifiable PIN. Submitting a BURS certificate that expires two days before tender closing, or an unreadable QR code that fails validation on the BURS e-services portal.',
      '2. Missing Commissioner of Oaths Stamp. Many statutory declarations (such as the declaration against corrupt practices or shareholding affidavits) must be signed before a Commissioner of Oaths. An uncommissioned declaration is legally void.',
      '3. Discrepancies in Tender Security / Bid Bond Wording. Procurement entities issue strict bank guarantee templates. Banks frequently insert standard internal clauses that alter the unconditional demand terms. If the wording diverges from the ITT requirement, the bond is rejected.',
      '4. Incorrect Number of Copies. If the tender specifies "one original and four duplicate hard copies", submitting one original and three copies is an automatic failure under strict compliance rules.',
      '5. Late Submission by Even Sixty Seconds. Tender boxes in Gaborone and Francistown close strictly at the designated hour (usually 10:00 or 11:00 AM). Being caught in traffic along Western Bypass or delayed at the security desk will cost you the entire bid.',
      '6. Failure to Attend Compulsory Site Visit. If a pre-bid meeting is gazetted as mandatory, failure to sign the official physical attendance register disqualifies any subsequently submitted proposal.',
      '7. Omitting an Addendum Acknowledgement. When procuring entities issue official clarification addenda during the tender period, bidders must formally acknowledge receipt in their letter of tender. Omitting this implies you bid on superseded terms.',
    ],
  },
  {
    id: 'art-3',
    slug: 'how-to-decide-whether-a-tender-is-worth-your-time',
    title: 'How to decide whether a tender is worth your time',
    category: 'Preparing to bid',
    readTime: '6 min read',
    publishedDate: '19 Sep 2026',
    summary: 'The most profitable tender decision you will ever make is knowing when to walk away. Use a rigorous Go / No-Go framework to conserve bid capital.',
    yoast: {
      metaTitle: 'Go or No-Go Framework for Botswana Tenders | TenderVantage',
      metaDescription: 'Calculate tender win probability and cash flow risks before spending thousands in non-refundable tender fees and bid preparation.',
      focusKeyword: 'tender go no-go decision botswana',
    },
    content: [
      'For many growing contractors, every newly published government gazette tender feels like an obligation. Yet bidding carries substantial costs: tender purchase fees (P250 to P5,000), bank guarantee issuance charges, document printing, and dozens of management hours.',
      'A disciplined Go / No-Go review prevents your company from exhausting its capital on low-probability bids. We recommend evaluating every opportunity against five clear criteria before paying the document fee.',
      'First: Technical Eligibility. Do your CIPA incorporation codes and PPADB registered codes precisely cover the required disciplines and financial grading ceiling? If the tender requires Grade D and your firm is Grade B without an approved joint venture partner, you cannot qualify.',
      'Second: Working Capital and Guarantee Capacity. Can your balance sheet support the performance bond (typically 10% of contract sum) and advance payment security, while funding the first 60 days of operations before the client issues the first interim payment certificate?',
      'Third: Strategic Relationship and Past Context. Is there an incumbent supplier who holds institutional advantages? While public procurement is competitive, understanding the operational baseline helps assess whether you can present a genuinely superior commercial proposition.',
      'Fourth: Clarification Timeframe. Is there sufficient time before the closing date to conduct proper site reconnaissance and obtain firm supplier quotations? If a 100-page complex tender closes in seven days and you are starting from zero, the probability of submitting a competitive proposal is marginal.',
      'If an opportunity scores below your internal threshold, decline it deliberately. Save your energy and balance sheet for tenders where your firm possesses a demonstrable competitive edge.',
    ],
  },
  {
    id: 'art-4',
    slug: 'pricing-a-bill-of-quantities-without-undercutting',
    title: 'Pricing a bill of quantities without undercutting yourself',
    category: 'Pricing',
    readTime: '5 min read',
    publishedDate: '12 Sep 2026',
    summary: 'Winning a tender at a price that bankrupts your business is worse than losing. How to price public sector BoQs realistically while protecting gross margin.',
    yoast: {
      metaTitle: 'How to Price a Bill of Quantities (BoQ) in Botswana | TenderVantage',
      metaDescription: 'Strategic pricing rules for Botswana tenders: managing 14% VAT, import logistics, inflation buffers, and margin protection.',
      focusKeyword: 'pricing bill of quantities boq botswana',
    },
    content: [
      'The "winner\'s curse" is widespread in competitive procurement: the lowest bidder wins the contract, only to realize their price failed to account for border clearance duties, local haulage logistics, or statutory wage revisions.',
      'When completing a Bill of Quantities (BoQ), remember that evaluators assess whether your rates are abnormally low. Under modernized procurement rules, unreasonably low bids can be flagged and subjected to rate breakdown justification requests.',
      'Key considerations for Botswana procurement schedules:',
      '1. Explicit VAT Handling. Botswana VAT is 14%. Verify whether each unit rate must be VAT-exclusive with VAT added only on the final Grand Summary page, or whether individual line rates must already incorporate VAT. Getting this wrong distorts your comparison against competing schedules by 14%.',
      '2. Currency Fluctuations and Customs. If inputs are sourced from South Africa (ZAR) or international manufacturers (USD), ensure exchange rate buffers or hedging contingencies are accounted for, especially on delivery timelines extending beyond 90 days.',
      '3. Preliminaries & General (P&Gs). Do not hide your indirect operational costs (site security, storage containers, insurance, health and safety officer) inside direct item rates. Detail your preliminaries so evaluators understand your site management is professional and funded.',
      '4. Arithmetic Integrity. Always verify that Excel formulas are unlocked and tested. Transposing an addition error into the formal Letter of Bid can either disqualify your submission or legally bind your company to an unviable contract value.',
    ],
  },
  {
    id: 'art-5',
    slug: 'writing-a-company-profile-evaluators-can-skim',
    title: 'Writing a company profile evaluators can skim',
    category: 'Writing',
    readTime: '4 min read',
    publishedDate: '5 Sep 2026',
    summary: 'Evaluators do not read company profiles like novels. They skim for compliance evidence, referee phone numbers, and director credentials. Structure yours for scoring.',
    yoast: {
      metaTitle: 'Tender-Ready Company Profile Writing Guide | TenderVantage',
      metaDescription: 'How to structure a corporate capability statement specifically for procurement committees and scoring rubrics in Botswana.',
      focusKeyword: 'company profile tender botswana',
    },
    content: [
      'Most commercial design agencies design corporate brochures for marketing exhibitions: full-page lifestyle photos, philosophical vision statements, and abstract prose. When submitted into a public procurement tender, these brochures score poorly.',
      'A tender-ready company profile is an evidentiary document. Its singular purpose is to make it effortless for an evaluator with a marking rubric in hand to award full points for corporate track record and organizational capacity.',
      'Structure your tender profile in four strict sections:',
      'Section 1: Corporate Identity & Statutory Compliance. Legal name, CIPA registration number, physical address in Botswana, directorship shareholding breakdown (highlighting citizen economic empowerment percentages), and BURS tax status.',
      'Section 2: Key Personnel & Organogram. Highlight three or four core technical specialists with relevant professional registrations (e.g. ERB for engineers, BICA for accountants) and concise bullet-point career summaries. Provide an organogram illustrating reporting lines.',
      'Section 3: Verified Project Portfolio. Present a clean tabular matrix of past contracts: Client Entity, Contract Title, Total Value in BWP, Start and Completion Dates, and the direct contact name and phone number of the client supervising officer.',
      'Section 4: Health, Safety & Environmental Commitment. A one-page concise policy statement confirming adherence to Botswana statutory workplace health and safety legislation.',
      'Keep your layout clean with generous white space and legible typography. Never hide key facts inside dense paragraphs.',
    ],
  },
  {
    id: 'art-6',
    slug: 'after-a-loss-reading-a-debrief-usefully',
    title: 'After a loss: reading a debrief usefully',
    category: 'After the bid',
    readTime: '4 min read',
    publishedDate: '29 Aug 2026',
    summary: 'Losing a tender is disappointing; failing to extract the evaluation data is negligent. How to request, interpret, and act upon formal debrief feedback.',
    yoast: {
      metaTitle: 'How to Request & Interpret a Tender Debrief in Botswana | TenderVantage',
      metaDescription: 'Extract maximum competitive intelligence from unsuccessful bids using PPRA debrief guidelines and scoring analysis.',
      focusKeyword: 'tender debrief feedback botswana',
    },
    content: [
      'In Botswana, receiving a regret letter is not the end of the procurement cycle. Under modern public procurement governance, unsuccessful bidders possess the formal right to request a debriefing session from the procuring entity.',
      'Many companies either react defensively with emotional accusations or do not follow up at all. Both reactions are missed opportunities. A formal debrief provides verified intelligence on your firm’s market standing that money cannot buy elsewhere.',
      'How to request a professional debrief:',
      'Within seven days of receiving the regret notification, submit a formal letter addressed to the Secretary of the Ministerial Tender Committee (MTC) or Chief Executive Officer. Keep the tone polite, constructive, and forward-looking.',
      'Specifically ask for your technical evaluation scoring breakdown against the published criteria, the total technical score of the winning bidder, and the awarded contract value.',
      'When reviewing the scores, separate administrative deficits from technical gaps. If you lost points because CVs lacked certified proof of academic qualifications, that is a mechanical error easily fixed for the next tender. If you lost points on the methodology, you know exactly which section of your proposal library requires strengthening.',
      'Treat every debrief as an investment in winning the next invitation to tender.',
    ],
  },
]
