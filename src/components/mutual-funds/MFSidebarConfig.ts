import {
  TrendingUp, BarChart2, PieChart, ArrowLeftRight, Receipt, Users, Layers,
  Camera, FileText, UserCircle, Database, BookOpen, Search, Activity,
  ShoppingCart, List, UserCheck, Globe, PlusCircle,
} from 'lucide-react';

export interface MFMenuItem {
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const MF_MENU: MFMenuItem[] = [
  { title: 'Invest in Mutual Funds',  path: '/dashboard/mf/invest',              icon: BarChart2        },
  { title: 'My Portfolio',            path: '/dashboard/mf/portfolio',           icon: PieChart         },
  { title: 'My SIPs',                 path: '/dashboard/mf/sips',                icon: Activity         },
  { title: 'Start a SIP',             path: '/dashboard/mf/sips/register',       icon: PlusCircle       },
  { title: 'Watchlist',               path: '/dashboard/mf/watchlist',           icon: Search           },
  { title: 'Transactions',            path: '/dashboard/mf/transactions',        icon: ArrowLeftRight   },
  { title: 'Switch',                  path: '/dashboard/mf/orders/switch',       icon: ArrowLeftRight   },
  { title: 'Redeem',                  path: '/dashboard/mf/orders/redeem',       icon: Receipt          },
];

export const MF_ADMIN_MENU: MFMenuItem[] = [
  { title: 'Portfolio Returns',       path: '/dashboard/mf/portfolio-returns',   icon: TrendingUp       },
  { title: 'Portfolio Journey',       path: '/dashboard/mf/portfolio-journey',   icon: Activity         },
  { title: 'Portfolio Summary',       path: '/dashboard/mf/portfolio-summary',   icon: PieChart         },
  { title: 'Capital Gains',           path: '/dashboard/mf/capital-gains',       icon: Receipt          },
  { title: 'Client Transactions',     path: '/dashboard/mf/client-transactions', icon: Users            },
  { title: 'Asset Allocation',        path: '/dashboard/mf/asset-allocation',    icon: Layers           },
  { title: 'Investment Snapshot',     path: '/dashboard/mf/snapshot',            icon: Camera           },
  { title: 'Reports',                 path: '/dashboard/mf/reports',             icon: FileText         },
  { title: 'Investor Profile',        path: '/dashboard/mf/investor-profile',    icon: UserCircle       },
  { title: 'RTA Transactions',        path: '/dashboard/mf/rta-transactions',    icon: Database         },
  { title: 'Scheme Factsheet',        path: '/dashboard/mf/scheme-factsheet',    icon: BookOpen         },
  { title: 'Portfolio Screener',      path: '/dashboard/mf/screener',            icon: Search           },
  { title: 'Place Order',             path: '/dashboard/mf/orders/purchase',     icon: ShoppingCart     },
  { title: 'Browse Schemes',          path: '/dashboard/mf/scheme-browser',      icon: Globe            },
  { title: 'Order History',           path: '/dashboard/mf/orders/list',         icon: List             },
  { title: 'Investor Master',         path: '/dashboard/mf/investor-master',     icon: BookOpen         },
  { title: 'User Master',             path: '/dashboard/mf/user-master',         icon: UserCheck        },
];
