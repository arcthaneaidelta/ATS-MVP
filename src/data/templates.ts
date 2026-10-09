import { CampaignTemplate } from '../types';

export const campaignTemplates: CampaignTemplate[] = [
  {
    id: 'tmpl-stl-sms',
    title: 'Instant Speed-to-Lead Welcome',
    channel: 'sms',
    stage: 'New Inquiry',
    body: 'Hi {{first_name}} — this is {{agent_name}} from Alder & Stone Homes. Thanks for asking about {{community}}! Want a quick tour this weekend? Reply 1 for Sat, 2 for Sun. Reply STOP to opt out.',
    segmentsCount: 1,
    charCount: 172,
    tags: ['Speed-to-Lead', 'SMS', 'High Conversion'],
  },
  {
    id: 'tmpl-stl-email',
    title: 'Digital VIP Lookbook & Floor Plans',
    channel: 'email',
    stage: 'New Inquiry',
    subject: 'Your {{community}} VIP Lookbook & Floor Plans — Alder & Stone Homes',
    previewText: 'Explore curated floor plans, lot orientations, and starting price sheets.',
    body: `Hi {{first_name}},

Thank you for your interest in {{community}} by Alder & Stone Homes.

Whether you are looking for an open-concept ranch like The Linden or a spacious two-story estate like The Calder, our homes are crafted with 2x6 exterior framing, conditioned crawlspaces, and luxury finishes that standard production builders charge thousands extra for.

Here is what we have prepared for you:
• Complete {{community}} Site Map & Available Lots
• Detailed Floor Plans with Dimensions & Optional Extensions
• Standard Features Sheet (Quartz Countertops, 9ft Ceilings, James Hardie Siding)

Would you like to schedule a private 30-minute walk-through of our decorated model home this week?

Warm regards,
{{agent_name}}
Online Sales Counselor | Alder & Stone Homes
(704) 555-0142 | charlotte@alderstonehomes.com`,
    tags: ['New Lead', 'Brochure', 'Floor Plans'],
  },
  {
    id: 'tmpl-mc-sms',
    title: 'Missed-Call Instant Text-Back',
    channel: 'sms',
    stage: 'Inbound Call',
    body: 'Sorry we missed your call! This is Alder & Stone Homes. How can we help? Looking to tour a model home or ask about lot availability? Reply STOP to cancel.',
    segmentsCount: 1,
    charCount: 154,
    tags: ['Speed-to-Lead', 'Call Recovery'],
  },
  {
    id: 'tmpl-tour-24h-sms',
    title: 'Tour Reminder (24 Hours Prior)',
    channel: 'sms',
    stage: 'Tour Booked',
    body: 'Hi {{first_name}}, looking forward to your tour tomorrow at {{tour_time}} at {{community}}! {{agent_name}} will have the model open. Reply YES to confirm or RESCHEDULE if needed. Reply STOP to cancel.',
    segmentsCount: 1,
    charCount: 189,
    tags: ['Calendar', 'No-Show Prevention'],
  },
  {
    id: 'tmpl-tour-2h-sms',
    title: 'Tour Reminder + Gate & Parking (2 Hours Prior)',
    channel: 'sms',
    stage: 'Tour Booked',
    body: 'Hi {{first_name}}, see you in 2 hours! Free parking right in front of the model at {{community_address}}. Dial #1042 at the gate if closed. Call or text {{agent_phone}} upon arrival! Reply STOP to cancel.',
    segmentsCount: 1,
    charCount: 198,
    tags: ['Calendar', 'VIP Arrival'],
  },
  {
    id: 'tmpl-post-tour-email',
    title: 'Post-Tour Homesite Pricing & Summary',
    channel: 'email',
    stage: 'Tour Completed',
    subject: 'Your Visit to {{community}} — Homesite Pricing & Next Steps',
    previewText: 'Here is the detailed itemization for {{plan}} and your 48-hour lot courtesy hold.',
    body: `Hi {{first_name}},

It was a pleasure hosting you today at {{community}}!

Attached is the full structural options pricing sheet for {{plan}}, as well as the site orientation details for the homesite we walked.

Key highlights from your visit:
• Homesite: Lot 14 (Generous tree-lined backyard buffer)
• Plan: {{plan}} with Optional Screened Porch & Gourmet Kitchen
• Estimated Completion Window: Late Spring 2027

Remember that we offer a 48-hour complimentary courtesy hold on homesites while you review financing with your lender.

Let me know if you would like me to lock this in for you!

Best regards,
{{agent_name}}
Community Sales Manager | Alder & Stone Homes`,
    tags: ['Post-Tour', 'Conversion', 'Pricing Sheet'],
  },
  {
    id: 'tmpl-nurture-craft-email',
    title: 'Craftsmanship: What is Behind the Drywall',
    channel: 'email',
    stage: 'Nurture (Day 1)',
    subject: 'Why Alder & Stone Builds with 2x6 Framing & Conditioned Crawlspaces',
    previewText: 'Take a look inside the structural engineering behind every Alder & Stone home.',
    body: `Hi {{first_name}},

Most buyers judge a home by its quartz countertops and paint colors. But what matters most is what you cannot see behind the drywall.

At Alder & Stone Homes:
1. We use 2x6 exterior wall construction (giving 50% more insulation capacity than standard 2x4 framing).
2. Every home features a fully sealed, conditioned crawlspace or insulated slab, preventing humidity and moisture issues common in the Carolinas.
3. Every HVAC duct run is sealed with mastic and pressure tested for zero leakage.

This means lower utility bills every month and a home that stays whisper quiet.

Take a 2-minute video tour behind our framing: [Watch Construction Video]

Warmly,
Robert Alder | Founder & Principal Builder`,
    tags: ['Nurture', 'Craftsmanship', 'Brand Trust'],
  },
  {
    id: 'tmpl-nurture-buydown-email',
    title: 'Financing: 2-1 Rate Buydown Program',
    channel: 'email',
    stage: 'Nurture (Day 7)',
    subject: 'How Our 2-1 Rate Buydown Cuts Your First Year Payment by $650/mo',
    previewText: 'Learn how Alder & Stone builder credits reduce your effective interest rate.',
    body: `Hi {{first_name}},

Concerned about interest rates? You are not alone.

That is why Alder & Stone Homes has partnered with Movement Mortgage to sponsor a 2-1 Interest Rate Buydown on select homes at {{community}}.

Here is how it works:
• Year 1: Your rate is 2% below current market (saving roughly $650/month)
• Year 2: Your rate is 1% below current market (saving roughly $325/month)
• Year 3+: Fixed market rate (with zero prepayment penalties if you choose to refinance sooner)

Alder & Stone covers the entire cost of the buydown at closing so you can ease into your new mortgage comfortably.

Want to see an exact payment breakdown for {{plan}}? Reply to this email and our mortgage specialist will run the numbers for you.

Best,
{{agent_name}}`,
    tags: ['Financing', 'Incentives', 'Nurture'],
  },
  {
    id: 'tmpl-nurture-vip-sms',
    title: 'VIP After-Hours Model Home Invite',
    channel: 'sms',
    stage: 'Nurture (Day 21)',
    body: 'Hi {{first_name}}, we are hosting a private sunset walk-through of The Calder model at Harlow Creek this Thursday at 6:30 PM with local wine & charcuterie. Would you and your family like to attend? Reply YES or STOP to opt out.',
    segmentsCount: 1,
    charCount: 218,
    tags: ['VIP Event', 'Nurture', 'SMS'],
  },
  {
    id: 'tmpl-nurture-lots-sms',
    title: 'Advance Notice: New Homesite Phase Release',
    channel: 'sms',
    stage: 'Nurture (Day 45)',
    body: 'Hi {{first_name}}, giving our priority list a 48-hr head start: 4 new cul-de-sac wooded lots are releasing at {{community}} this Friday before MLS launch. Tap here for the map & pricing: https://aldr.st/lots-vip Reply STOP to opt out.',
    segmentsCount: 1,
    charCount: 226,
    tags: ['VIP Release', 'Urgency', 'SMS'],
  },
  {
    id: 'tmpl-reactivation-sms',
    title: '9-Word Dormant Lead Reactivation',
    channel: 'sms',
    stage: 'Cold Reactivation',
    body: 'Hi {{first_name}}, are you still looking to build in the Charlotte area, or have your plans changed? — {{agent_name}}, Alder & Stone Homes. Reply STOP to opt out.',
    segmentsCount: 1,
    charCount: 156,
    tags: ['Reactivation', 'High Reply Rate'],
  },
  {
    id: 'tmpl-review-request-sms',
    title: 'Post-Closing Satisfaction & Review Check',
    channel: 'sms',
    stage: 'Closed Won',
    body: 'Hi {{first_name}}! Robert Alder here. How are you loving your new home at {{community}}? On a scale of 1-5, how has your building experience been with our team? Reply 1-5 or STOP to opt out.',
    segmentsCount: 1,
    charCount: 184,
    tags: ['Reputation', 'Google Reviews'],
  },
  {
    id: 'tmpl-design-studio-email',
    title: 'Design Studio Selections Consultation Prep',
    channel: 'email',
    stage: 'Design Consult',
    subject: 'Preparing for Your Design Studio Appointment — Alder & Stone Homes',
    previewText: 'Cabinet finishes, quartz samples, and smart home packages guide.',
    body: `Hi {{first_name}},

Congratulations on ratifying your purchase agreement! Now comes the most exciting part of the journey: selecting the finishes and personal touches that make your home uniquely yours.

Your 3-hour Design Studio appointment is scheduled for next Tuesday at our Design Center in South End Charlotte.

To make the most of our time together:
1. Review our digital Design Lookbook (attached)
2. Save your favorite Pinterest or Instagram inspiration photos
3. Review standard included features vs tier-one and tier-two upgrades

Our Selections Coordinator looks forward to designing with you!

Best,
The Alder & Stone Team`,
    tags: ['Design Studio', 'Selections', 'Customer Journey'],
  },
  {
    id: 'tmpl-custom-lot-email',
    title: 'Custom Build: Site Feasibility & Perk Review',
    channel: 'email',
    stage: 'Custom Inquiries',
    subject: 'Your Custom Build Inquiry — Site Feasibility & Next Steps',
    previewText: 'Acreage review, zoning setbacks, and architectural adaptation in Charlotte.',
    body: `Hi {{first_name}},

Thank you for reaching out regarding building on your homesite in the Greater Charlotte area.

Building on your own land requires specific expertise in:
• Septic suitability / perk testing
• Well vs municipal water tie-ins
• Grading, clearing, and stormwater drainage
• Setback easements and zoning overlay restrictions

We have built dozens of custom homes across Mecklenburg, Union, and York Counties. We would love to review your parcel survey and walk the land with you.

Can we schedule a 15-minute introductory call this week?

Warmly,
Robert Alder | Founder & Master Builder
Alder & Stone Homes`,
    tags: ['Custom Build', 'On-Your-Lot', 'High Ticket'],
  },
];
