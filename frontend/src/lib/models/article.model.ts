interface Article {
    id: string;
    title: string;
    content: string;
    location: string;
    pause?: boolean;
    day: number; // at what date in the simulation does this article get pushed to feed
}