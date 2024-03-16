export const errorMessage = (error: unknown) => {
     return error instanceof Error
       ? error.response?.data?.msg ?? "An error occurred"
       : "An error occurred";
   };