import { TypographyStyleOptions } from "@mui/material/styles/createTypography";

export interface Page {
    title: string;
    path: string;
    element: React.ReactNode;
    showInMenu: boolean
}

declare module "@mui/material/styles" {
   interface TypographyVariants {
      title: TypographyStyleOptions;
   }

   // allow configuration using `createTheme`
   interface TypographyVariantsOptions {
      title?: TypographyStyleOptions;
   }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
   interface TypographyPropsVariantOverrides {
      title: true;
   }
}

