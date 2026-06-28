'use strict';

window.SiteConfig = {
    brand: {
        name: 'DryHouse Match',
        tagline: 'Independent Water Damage Provider Matching',
        logo: 'assets/images/logo.svg',
        logoAlt: 'DryHouse Match logo'
    },

    company: {
        name: 'DryHouse Match',
        legalName: 'DryHouse Match',
        companyId: 'DHM-WD-2026',
        address: 'USA Service Area',
        serviceArea: 'Independent provider matching across selected service areas'
    },

    contact: {
        phoneRaw: '+18885550194',
        phoneDisplay: '(888) 555-0194',
        phoneButtonText: 'Start Request',
        email: 'support@dryhousematch.com',
        supportHours: 'Request access available 24/7'
    },

    navigation: [
        {
            label: 'Home',
            url: 'index.html'
        },
        {
            label: 'About',
            url: 'about.html'
        },
        {
            label: 'Services',
            url: 'all-services.html'
        },
        {
            label: 'Contact',
            url: 'contact.html'
        }
    ],

    services: [
        {
            id: 'active-leak-damage',
            title: 'Active Leak Damage',
            shortTitle: 'Active Leak',
            file: 'active-leak-damage.html',
            icon: 'droplets',
            image: 'assets/images/service-1.jpg',
            heroImage: 'assets/images/hero-active-leak.jpg',
            description: 'For situations where water is actively entering or spreading inside the home, including ceiling leaks, wall leaks, roof-related water entry, plumbing leaks, or appliance-related water issues.',
            safeSummary: 'Submit leak details and compare available local provider options suited to active water-entry concerns.'
        },
        {
            id: 'standing-water-cleanup',
            title: 'Standing Water Cleanup',
            shortTitle: 'Standing Water',
            file: 'standing-water-cleanup.html',
            icon: 'waves',
            image: 'assets/images/service-2.jpg',
            heroImage: 'assets/images/hero-standing-water.jpg',
            description: 'For rooms or areas where water is already standing on the floor, including kitchens, bathrooms, utility rooms, basements, or living spaces.',
            safeSummary: 'Share standing-water details and review provider options that may serve your location.'
        },
        {
            id: 'burst-pipe-damage',
            title: 'Burst Pipe Damage',
            shortTitle: 'Burst Pipe',
            file: 'burst-pipe-damage.html',
            icon: 'wrench',
            image: 'assets/images/service-3.jpg',
            heroImage: 'assets/images/hero-burst-pipe.jpg',
            description: 'For sudden pipe-related water damage, frozen pipe incidents, broken supply lines, wall or ceiling saturation, and fast-spreading water concerns.',
            safeSummary: 'Organize burst-pipe request details and compare local provider options before choosing next steps.'
        },
        {
            id: 'flooded-basement',
            title: 'Flooded Basement',
            shortTitle: 'Basement Flooding',
            file: 'flooded-basement.html',
            icon: 'house',
            image: 'assets/images/service-4.jpg',
            heroImage: 'assets/images/hero-flooded-basement.jpg',
            description: 'For basement water entry, seepage, storm water accumulation, drain backup concerns, damp lower-level rooms, and floor-level water issues.',
            safeSummary: 'Start a basement water request and review available provider options for lower-level water concerns.'
        },
        {
            id: 'storm-flood-damage',
            title: 'Storm & Flood Damage',
            shortTitle: 'Storm Flood',
            file: 'storm-flood-damage.html',
            icon: 'cloud-rain',
            image: 'assets/images/service-5.jpg',
            heroImage: 'assets/images/hero-storm-flood.jpg',
            description: 'For storm-related water intrusion, heavy rain flooding, exterior water entry, roof-adjacent water damage, and weather-related water concerns.',
            safeSummary: 'Describe storm or flood damage details and compare provider options that may be available nearby.'
        },
        {
            id: 'moisture-mold-concerns',
            title: 'Moisture & Mold Concerns',
            shortTitle: 'Moisture Concerns',
            file: 'moisture-mold-concerns.html',
            icon: 'scan-search',
            image: 'assets/images/service-6.jpg',
            heroImage: 'assets/images/hero-moisture-mold.jpg',
            description: 'For damp smells, moisture spots, suspicious stains, humidity-related damage, and possible mold-related concerns. DryHouse Match does not diagnose mold or provide medical advice.',
            safeSummary: 'Submit moisture concern details and review local provider options without diagnostic or medical claims.'
        }
    ],

    footer: {
        description: 'DryHouse Match is an independent provider-matching platform that helps homeowners submit water-damage request details and compare available local provider options.',
        copyright: '© 2026 DryHouse Match. All rights reserved.',
        shortDisclaimer: 'DryHouse Match is not a contractor, restoration company, plumbing company, inspection company, insurer, or direct service provider.'
    },

    legal: {
        privacyUrl: 'privacy-policy.html',
        termsUrl: 'terms-of-service.html',
        cookieUrl: 'cookie-policy.html',
        disclaimer: 'Disclaimer: This site is a free service to assist homeowners in connecting with local service providers. All contractors/providers are independent and this site does not warrant or guarantee any work performed. It is the responsibility of the homeowner to verify that the hired contractor furnishes the necessary license and insurance required for the work being performed. All persons depicted in a photo or video are actors or models and not contractors listed on this site.'
    },

    form: {
        endpoint: 'contact.php',
        recipient: 'support@dryhousematch.com',
        sourcePageDefault: 'DryHouse Match website request form',
        successMessage: 'Thank you. Your request has been received.',
        errorMessage: 'Please check the required fields and try again.',
        consentText: 'I understand that submitting this form does not create a service agreement and that I may be contacted by participating providers about my request.'
    },

    sharedCta: {
        eyebrow: 'Independent provider matching',
        title: 'Ready to compare provider options?',
        text: 'Start your request and review available local options. Final pricing, availability, scheduling, warranties, and service terms are provided by participating providers.',
        primaryLabel: 'Submit project details',
        primaryUrl: 'contact.html',
        secondaryLabel: 'View services',
        secondaryUrl: 'all-services.html'
    },

    stats: [
        {
            value: '6',
            label: 'Service categories'
        },
        {
            value: '3',
            label: 'Step request path'
        },
        {
            value: '24/7',
            label: 'Request access'
        },
        {
            value: '1',
            label: 'Homeowner choice'
        }
    ]
};
