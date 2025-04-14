// This is a mock AI instance for static export
// Remove this file and use the real AI instance for development
export const ai = {
  definePrompt: () => {
    return () => ({
      output: []
    });
  },
  defineFlow: () => {
    return async () => {
      return [];
    };
  }
};
