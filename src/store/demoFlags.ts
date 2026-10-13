export interface DemoFlags {
  failNextConnect: boolean;
  failNextSave: boolean;
  slowNetwork: boolean;
  showEmptyState: boolean;
  showErrorState: boolean;
}

export const defaultDemoFlags: DemoFlags = {
  failNextConnect: false,
  failNextSave: false,
  slowNetwork: false,
  showEmptyState: false,
  showErrorState: false,
};
