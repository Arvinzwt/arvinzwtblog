import {Inter, Lusitana} from 'next/font/google';
import localFont from 'next/font/local'

export const inter = Inter({
  subsets: ['latin']
});

export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const xinDiZhaoMeng = localFont({
  src: './XinDiZhaoMeng-1.otf',
  display: 'swap',
})

export const monaco = localFont({
  src: './Monaco-1.ttf',
  display: 'swap',
})