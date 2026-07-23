import { NavGroup } from "@/components/layout/navigation/types";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PeopleIcon from "@mui/icons-material/People";
import WebIcon from "@mui/icons-material/Web";
import KeyIcon from "@mui/icons-material/Key";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PasswordIcon from "@mui/icons-material/Password";
import { AdminDto } from "@myorg/shared/dto";

export const NAV_GROUPS: (role: AdminDto["role"]) => NavGroup[] = (role) => [
    {
        items: [
            {
                label: "pages.admin.bank.name",
                href: FULL_PATH_ROUTE.admin.bank.path,
                activeLink: {
                    strict: [
                        FULL_PATH_ROUTE.admin.path,
                    ],
                    safe: [FULL_PATH_ROUTE.admin.bank.path],
                },
                icon: <WebIcon />,
            },
            {
                label: "pages.admin.bank.token.name",
                href: FULL_PATH_ROUTE.admin.tokens.path,
                activeLink: {
                    safe: [FULL_PATH_ROUTE.admin.tokens.path],
                },
                icon: <KeyIcon />,
            },
            {
                label: "pages.admin.bank.continueToken.name",
                href: FULL_PATH_ROUTE.admin.continueAccess.path,
                activeLink: {
                    safe: [FULL_PATH_ROUTE.admin.continueAccess.path],
                },
                icon: <LockOpenIcon />,
            },
            {
                label: "pages.admin.file.name",
                href: FULL_PATH_ROUTE.admin.file.path,
                activeLink: {
                    safe: [FULL_PATH_ROUTE.admin.file.path],
                },
                icon: <InsertDriveFileOutlinedIcon />,
            },
            {
                label: "pages.admin.data.name",
                href: FULL_PATH_ROUTE.admin.data.path,
                activeLink: {
                    safe: [FULL_PATH_ROUTE.admin.data.path],
                },
                icon: <TuneIcon />,
            },
            {
                label: "pages.admin.parcel.name",
                href: FULL_PATH_ROUTE.admin.parcel.path,
                activeLink: {
                    safe: [FULL_PATH_ROUTE.admin.parcel.path],
                },
                icon: <LocalShippingOutlinedIcon />,
            },
            {
                label: "pages.admin.codes.name",
                href: FULL_PATH_ROUTE.admin.codes.path,
                activeLink: {
                    safe: [FULL_PATH_ROUTE.admin.codes.path],
                },
                icon: <PasswordIcon />,
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
