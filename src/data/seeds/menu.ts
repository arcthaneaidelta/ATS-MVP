import { MenuItem } from '../../types';

export const initialMenuItems: Record<string, MenuItem[]> = {
  'tenant-kiln': [
    // STARTERS
    {
      id: 'kiln-starters-1',
      name: 'Charred Cauliflower, Tahini',
      description: 'Wood-fired cauliflower florets, whipped sesame tahini, toasted pine nuts, sumac pomegranate glaze.',
      category: 'Starters',
      price: 9.50,
      tags: ['VG', 'GF'],
      modifierGroups: [
        {
          id: 'mod-chilli',
          name: 'Condiments',
          required: false,
          options: [
            { id: 'opt-chilli-oil', name: 'Add house chilli oil', priceDelta: 0.75 },
            { id: 'opt-extra-tahini', name: 'Extra whipped tahini', priceDelta: 1.00 },
          ],
        },
      ],
    },
    {
      id: 'kiln-starters-2',
      name: 'Crispy Salt & Pepper Calamari',
      description: 'Cornflour dusted baby squid, charred lemon cheek, fermented garlic aioli.',
      category: 'Starters',
      price: 11.00,
      tags: ['GF'],
      modifierGroups: [
        {
          id: 'mod-dip',
          name: 'Dipping Sauce',
          required: false,
          options: [
            { id: 'opt-smoked-aioli', name: 'Smoked paprikash dip', priceDelta: 0.75 },
          ],
        },
      ],
    },
    {
      id: 'kiln-starters-3',
      name: 'Heritage Tomato & Stracciatella',
      description: 'Heirloom oxheart tomatoes, torn stracciatella, cold-pressed olive oil, purple basil leaves.',
      category: 'Starters',
      price: 10.50,
      tags: ['V', 'GF'],
    },
    // MAINS
    {
      id: 'kiln-mains-1',
      name: 'Slow-Cooked Short Rib',
      description: '12-hour braised bone-in beef short rib, smoked bone marrow jus, roasted shallots.',
      category: 'Mains',
      price: 24.50,
      tags: ['GF'],
      modifierGroups: [
        {
          id: 'mod-side-req',
          name: 'Choose a side (Required)',
          required: true,
          options: [
            { id: 'opt-fries', name: 'Hand-cut triple cooked fries', priceDelta: 0.00 },
            { id: 'opt-greens', name: 'Steamed seasonal bitter greens', priceDelta: 0.00 },
            { id: 'opt-rice', name: 'Fragrant buttered basmati rice', priceDelta: 0.00 },
          ],
        },
        {
          id: 'mod-rib-extra',
          name: 'Add-ons',
          required: false,
          options: [
            { id: 'opt-extra-jus', name: 'Extra bone marrow jus cup', priceDelta: 2.00 },
          ],
        },
      ],
    },
    {
      id: 'kiln-mains-2',
      name: 'Lamb Kofta Flatbread',
      description: 'Spiced minced lamb shoulder, grilled flatbread, pickled red cabbage, garlic labneh, fresh mint.',
      category: 'Mains',
      price: 16.00,
      tags: ['Spicy'],
      modifierGroups: [
        {
          id: 'mod-kofta-protein',
          name: 'Protein Swap',
          required: false,
          options: [
            { id: 'opt-beef-swap', name: 'Swap for spiced wagyu beef', priceDelta: 2.50 },
            { id: 'opt-falafel-swap', name: 'Swap for herb falafel (Vegetarian)', priceDelta: 0.00 },
          ],
        },
        {
          id: 'mod-kofta-extras',
          name: 'Customise',
          required: false,
          options: [
            { id: 'opt-pickles', name: 'Extra wild cucumber pickles', priceDelta: 1.00 },
            { id: 'opt-chilli-side', name: 'Pickled green chillies on side', priceDelta: 0.50 },
          ],
        },
      ],
    },
    {
      id: 'kiln-mains-3',
      name: 'Wild Mushroom Risotto',
      description: 'Acquerello carnaroli rice, foraged chanterelles, black garlic emulsion, aged parmesan crisp.',
      category: 'Mains',
      price: 17.50,
      tags: ['V'],
      modifierGroups: [
        {
          id: 'mod-egg',
          name: 'Garnish Option',
          required: false,
          options: [
            { id: 'opt-soft-egg', name: 'Add soft-poached pasture egg', priceDelta: 1.50 },
            { id: 'opt-truffle-oil', name: 'Drizzle white truffle oil', priceDelta: 2.50 },
          ],
        },
      ],
    },
    {
      id: 'kiln-mains-4',
      name: 'Pan-Roasted Sea Bass',
      description: 'Crisp-skin sea bass fillet, saffron fennel broth, cockles, tenderstem broccoli.',
      category: 'Mains',
      price: 22.00,
      tags: ['GF'],
    },
    // SIDES
    {
      id: 'kiln-sides-1',
      name: 'Triple-Cooked Rosemary Fries',
      description: 'Maris piper potatoes, coarse rosemary sea salt, malt vinegar reduction.',
      category: 'Sides',
      price: 5.50,
      tags: ['VG', 'GF'],
    },
    {
      id: 'kiln-sides-2',
      name: 'Charred Broccolini & Hazelnut',
      description: 'Grilled broccolini, roasted hazelnut butter, preserved lemon peel.',
      category: 'Sides',
      price: 6.50,
      tags: ['V', 'GF'],
    },
    // DESSERTS
    {
      id: 'kiln-desserts-1',
      name: 'Saffron Rice Pudding',
      description: 'Slow-simmered arborio, saffron threads, cardamom rosewater syrup, toasted crushed pistachios.',
      category: 'Desserts',
      price: 7.00,
      tags: ['V', 'GF'],
      branchAvailability: {
        Riverside: false, // Sold out at Riverside as requested in Section 11.2
        Central: true,
        Airport: true,
      },
      modifierGroups: [
        {
          id: 'mod-rice-pudding',
          name: 'Toppings',
          required: false,
          options: [
            { id: 'opt-extra-pistachio', name: 'Extra crushed pistachios', priceDelta: 0.50 },
          ],
        },
      ],
    },
    {
      id: 'kiln-desserts-2',
      name: 'Dark Chocolate Ganache Tart',
      description: '70% Valrhona dark chocolate, sea salt flake, malted milk ice cream.',
      category: 'Desserts',
      price: 8.00,
      tags: ['V'],
    },
    // DRINKS
    {
      id: 'kiln-drinks-1',
      name: 'House Lemonade',
      description: 'Freshly pressed Eureka lemons, infused thyme syrup, sparkling spring water.',
      category: 'Drinks',
      price: 4.50,
      tags: ['VG'],
      modifierGroups: [
        {
          id: 'mod-size-req',
          name: 'Serving Size (Required)',
          required: true,
          options: [
            { id: 'opt-reg', name: 'Regular (330ml)', priceDelta: 0.00 },
            { id: 'opt-large', name: 'Large Carafe (500ml)', priceDelta: 1.25 },
          ],
        },
      ],
    },
    {
      id: 'kiln-drinks-2',
      name: 'Sparkling Elderflower Soda',
      description: 'Hand-picked elderflower cordial, cucumber ribbon, fresh lime, soda water.',
      category: 'Drinks',
      price: 4.75,
      tags: ['VG'],
    },
    {
      id: 'kiln-drinks-3',
      name: 'Pour-Over Cold Brew',
      description: 'Single-origin Ethiopian Yirgacheffe steeped for 18 hours, served over carved ice block.',
      category: 'Drinks',
      price: 4.50,
      tags: ['VG'],
    },
  ],
  'tenant-harbour': [
    {
      id: 'harbour-drinks-1',
      name: 'Flat White (Origin Roast)',
      description: 'Double ristretto shot, velvety steamed milk, caramel nutty finish.',
      category: 'Drinks',
      price: 4.20,
      tags: ['V'],
      modifierGroups: [
        {
          id: 'mod-milk-req',
          name: 'Milk Choice (Required)',
          required: true,
          options: [
            { id: 'opt-whole', name: 'Whole Dairy Milk', priceDelta: 0.00 },
            { id: 'opt-oat', name: 'Minor Figures Oat Milk', priceDelta: 0.60 },
            { id: 'opt-almond', name: 'Roasted Almond Milk', priceDelta: 0.60 },
          ],
        },
      ],
    },
    {
      id: 'harbour-drinks-2',
      name: 'Single Origin Batch Brew',
      description: 'Rotating Colombian washed lot, stone fruit and honey notes.',
      category: 'Drinks',
      price: 3.80,
      tags: ['VG'],
    },
    {
      id: 'harbour-starters-1',
      name: 'Warm Cardamom Bun',
      description: 'Swedish style laminated sourdough bun, freshly crushed cardamom, raw pearl sugar.',
      category: 'Desserts',
      price: 4.50,
      tags: ['V'],
    },
    {
      id: 'harbour-mains-1',
      name: 'Smoked Salmon & Rye Toast',
      description: 'Cold-smoked wild salmon, whipped cream cheese, caper berries, pickled dill on toasted rye.',
      category: 'Mains',
      price: 11.50,
      tags: [],
    },
  ],
};
