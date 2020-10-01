export const noTags = (name: string): boolean => 
    name === 'master' || 
    name === 'main' || 
    !!name.match(/^\d+(\.\d+)$/);