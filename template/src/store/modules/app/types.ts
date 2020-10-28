export interface Menu {
  active: number[];
  systemRoutes: {};
  systemName: string;
}

export interface Flexible {
  outerWidth: number;
  outerHeight: number;
  fontSize: number;
  screenW: number;
  screenH: number;
}

export interface App {
  menu: Menu;
  fullScreen: Boolean;
  flexible: {}
}

