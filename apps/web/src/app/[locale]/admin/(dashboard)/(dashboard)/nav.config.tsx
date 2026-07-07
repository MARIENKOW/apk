import { NavGroup } from "@/components/layout/navigation/types";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PeopleIcon from "@mui/icons-material/People";
import WebIcon from "@mui/icons-material/Web";
import KeyIcon from "@mui/icons-material/Key";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { AdminDto } from "@myorg/shared/dto";

export const NAV_GROUPS: (role: AdminDto["role"]) => NavGroup[] = (role) => [
    {
        items: [
            {
                label: "pages.admin.landing.name",
                href: FULL_PATH_ROUTE.admin.landing.path,
                activeLink: {
                    strict: [
                        FULL_PATH_ROUTE.admin.path,
                    ],
                    safe: [FULL_PATH_ROUTE.admin.landing.path],
                },
                icon: <WebIcon />,
            },
            {
                label: "pages.admin.landing.token.name",
                href: FULL_PATH_ROUTE.admin.tokens.path,
                activeLink: {
                    safe: [FULL_PATH_ROUTE.admin.tokens.path],
                },
                icon: <KeyIcon />,
            },
            {
                label: "pages.admin.file.name",
                href: FULL_PATH_ROUTE.admin.file.path,
                activeLink: {
                    safe: [FULL_PATH_ROUTE.admin.file.path],
                },
                icon: <InsertDriveFileOutlinedIcon />,
            },
        ],
    },
    {
        items: [
            ...(role === "SUPERADMIN"
                ? [
                      {
                          label: "pages.admin.admins.name",
                          href: FULL_PATH_ROUTE.admin.admins.path,
                          activeLink: {
                              safe: [FULL_PATH_ROUTE.admin.admins.path],
                          },
                          icon: <PeopleIcon />,
                      },
                      {
                          label: "pages.admin.invitation.name",
                          href: FULL_PATH_ROUTE.admin.invitations.path,
                          activeLink: {
                              safe: [FULL_PATH_ROUTE.admin.invitations.path],
                          },
                          icon: <MailOutlineIcon />,
                      },
                  ]
                : []),
        ],
    },
];
