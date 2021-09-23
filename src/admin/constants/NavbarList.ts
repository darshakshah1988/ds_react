import {
  DashboardIcon,
  ArtistsIcon,
  ArtworkIcon,
  UsersIcon,
  ReportsIcon
} from '../svgs';

// Props
type NavbarListItem = {
  id: number;
  text: string;
  path: string;
  icon: any;
};

// NavList items
const navlist: Array<NavbarListItem> = [
  {
    id: 1,
    text: 'Dashboard',
    path: '/admin/artists/add',
    icon: DashboardIcon
  },
  {
    id: 2,
    text: 'Artists',
    path: '/admin/artists',
    icon: ArtistsIcon
  },

  {
    id: 3,
    text: 'Artwork',
    path: '/admin/artworks',
    icon: ArtworkIcon
  },

  {
    id: 4,
    text: 'Users',
    path: '/admin/users',
    icon: UsersIcon
  },
  {
    id: 5,
    text: 'Reports',
    path: '/admin/reports',
    icon: ReportsIcon
  }
];

export default navlist;
