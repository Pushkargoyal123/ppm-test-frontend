import {
  Home,
  HowToReg,
  LockOpen,
  ShowChart,
  CardMembership,
  CardGiftcard,
  SettingsSystemDaydream,
  Info,
  ContactSupport,
  PortraitSharp,
  PostAdd,
  ExitToApp,
  BrandingWatermark
} from "@material-ui/icons";


const timeDuration = [
  {
    uniq: "D",
    time: "10 days",
    number: 10
  },
  {
    uniq: "D",
    time: "20 days",
    number: 20
  },
  {
    uniq: "M",
    time: "1 month",
    number: 1
  },
  {
    uniq: "M",
    time: "2 months",
    number: 2
  },
  {
    uniq: "M",
    time: "3 months",
    number: 3
  },
  {
    uniq: "A",
    time: "ALL",
    number: null
  },
];

const loggedOut_menuItems = [
  {
    link: "/",
    name: "Home",
    icon: <Home className="text-white" />
  },
  {
    link: "/stocks",
    name: "Stocks",
    icon: <ShowChart className="text-white" />
  },
  {
    link: "/membership",
    name: "MemberShip",
    icon: <CardMembership className="text-white" />
  },
  {
    name: "Fetch-Certificate",
    modal: true,
    icon: <CardGiftcard className="text-white" />
  },
  {
    link: "/dreamnifty",
    name: "Dream-Nifty",
    icon: <SettingsSystemDaydream className="text-white" />
  },
  {
    link: "/blog",
    name: "Blog",
    icon: <PostAdd className="text-white" />
  },
  {
    link: "/aboutus",
    name: "About US",
    icon: <Info className="text-white" />
  },
  {
    link: "/contactus",
    name: "Contact US",
    icon: <ContactSupport className="text-white" />
  },
  {
    name: "Register",
    icon: <HowToReg className="text-white" />
  },
  {
    name: "Login",
    icon: <LockOpen className="text-white" />
  }
];

const loggedIn_menuItems = [
  {
    link: "/c/dashboard",
    name: "Home",
    icon: <Home className="text-white" />
  },
  {
    menus: "stocks",
    name: "Stocks",
    icon: <ShowChart className="text-white" />
  },
  {
    link: "/portfolio",
    name: "Portfolio",
    icon: <PortraitSharp className="text-white" />
  },
  {
    link: "/leaderboard",
    name: "Leader Board",
    icon: <BrandingWatermark className="text-white" />
  },
  // {
  //   link: "/post",
  //   name: "Blog",
  //   icon: <PostAdd className="text-white" />
  // },
  {
    link: "/aboutus",
    name: "About US",
    icon: <Info className="text-white" />
  },
  {
    link: "/contactus",
    name: "Contact US",
    icon: <ContactSupport className="text-white" />
  },
  {
    button: true,
    name: "Log Out",
    icon: <ExitToApp className="text-white" />
  },
];

export {
  timeDuration,
  loggedOut_menuItems,
  loggedIn_menuItems
}