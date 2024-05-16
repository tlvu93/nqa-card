import { Header } from '@/components/Header.tsx/Header';

type Props = {
  children: React.ReactNode;
};

export function BaseLayout({ children }: Props) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
