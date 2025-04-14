export function generateStaticParams() {
  // For a static export, we need to return an empty array
  // We'll generate a few dummy params to ensure paths are generated
  return [
    { topicId: "placeholder1" },
    { topicId: "placeholder2" },
    { topicId: "placeholder3" },
  ];
} 