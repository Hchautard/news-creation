export default interface News {
  title: string;
  description: string;
  content: string;
  date_event: string;
  category: string;
  location: string;
  image: File | null;
}
