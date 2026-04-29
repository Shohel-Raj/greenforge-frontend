import { NavSection } from "@/types/dashboard.types";
import { getDefaultDashboardRoute, UserRole } from "./authUtils";


export const getCommonNavItems = (role : UserRole) : NavSection[] => {
    const defaultDashboard = getDefaultDashboardRoute(role);
    return [
        {
            // title : "Dashboard",
            items : [
                {
                    title : "Home",
                    href : "/",
                    icon : "Home"
                },
                {
                    title : "Dashboard",
                    href : defaultDashboard,
                    icon : "LayoutDashboard"

                },
                {
                    title: "My Profile",
                    href: `/my-profile`,
                    icon: "User",
                },
            ]
        },
        {
            title : "Settings",
            items : [
                {
                    title : "Change Password",
                    href : "change-password",
                    icon : "Settings"
                }
            ]
        }
    ]
}


export const memberNavItems : NavSection[] = [
    {
        title: " My Activity Management",
        items : [
            {
                title : "Add Idea",
                href : "/member/dashboard/appointments",
                icon : "Calender"
            },
            {
                title: "Manage Idea",
                href: "/member/dashboard/my-schedules",
                icon: "Clock",
            },
            {
                title: "Watchlist",
                href: "/member/dashboard/Watchlist",
                icon: "FileText",
            },

        ]
    }
]

export const adminNavItems: NavSection[] = [
    {
        title: "User Management",
        items: [
            {
                title: "Member",
                href: "/admin/dashboard/member-management",
                icon: "Shield",
            },

        ],
    },
    {
        title: "Idea Management",
        items: [
            {
                title: "idea",
                href: "/admin/dashboard/idea-management",
                icon: "Calendar",
            },

            {
                title: "Category",
                href: "/admin/dashboard/category-management",
                icon: "Hospital",
            },
            {
                title: "Payments",
                href: "/admin/dashboard/payments-management",
                icon: "CreditCard",
            },
            {
                title: "Comments",
                href: "/admin/dashboard/comments-management",
                icon: "Star",
            },
        ],
    },
];



export const getNavItemsByRole = (role : UserRole) : NavSection[] => {
    const commonNavItems = getCommonNavItems(role);

    switch (role) {
        case "ADMIN":
            return [...commonNavItems, ...adminNavItems];

        case "MEMBER":
            return [...commonNavItems, ...memberNavItems];

    }


}