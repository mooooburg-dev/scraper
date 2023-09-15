import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

type Props = {
  searchKeyword: string;
  products: any[];
};

const baseURL: string = 'https://www.coupang.com';

export default function ProductsPage({ searchKeyword, products }: Props) {
  return (
    <div className="container px-32">
      <Head>
        <title>{`현재 쿠팡에서 제일 잘 팔리고 있는 ${searchKeyword}`}</title>
        <meta
          name="description"
          content={`현재 쿠팡에서 제일 잘 팔리고 있는 ${searchKeyword}`}
        />
      </Head>
      <div className="pt-14">
        <h1 className="mb-4 font-extrabold">
          {`현재 쿠팡에서 제일 잘 팔리고 있는 "${searchKeyword}"`}
        </h1>
      </div>
      {products &&
        products.map((product, index) => (
          <div key={index} className="mb-4 flex">
            <Link href={`${baseURL}${product.link}`} className="mb-4 flex">
              <Image
                src={`https:${product.image}`}
                alt={product.title}
                width={260}
                height={260}
                priority
              />
              <div className="m-4">{product.title}</div>
            </Link>
          </div>
        ))}
    </div>
  );
}

const axios = require('axios');
const cheerio = require('cheerio');

import chromium from 'chrome-aws-lambda';
import playwright from 'playwright-core';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { query } = context;
  const searchId: string = query.q;

  let ulList: any[] = [];

  const browser = await playwright.chromium
    .launch({
      args: [
        ...chromium.args,
        '--font-render-hinting=none',
        '--no-sandbox',
        '--disabled-setupid-sandbox',
      ], // This way fix rendering issues with specific fonts
      executablePath:
        process.env.NODE_ENV === 'production'
          ? await chromium.executablePath
          : '/usr/local/bin/chromium',
      headless:
        process.env.NODE_ENV === 'production' ? chromium.headless : true,
    })
    .then(async (browser: any) => {
      const page = await browser.newPage();
      // await page.goto(
      //   `https://www.coupang.com/np/search?component=186664&q=%EC%9B%90%ED%94%BC%EC%8A%A4&channel=user`
      // );
      // await page.goto(`https://www.naver.com`);
      await page.goto(`https://www.coupang.com/np/categories/186764`);
      // await page.goto(`https://www.cgv.co.kr`);
      await page.waitForTimeout(5000);
      const content = await page.content();
      console.log(content);
      const $ = cheerio.load(content);
      await browser.close();
      const bodyList: any[] = $('#productList>li');
      bodyList.map((i, el) => {
        ulList[i] = {
          no: i,
          title: $(el).find('.descriptions .name').text(),
          image: $(el)
            .find('.image .search-product-wrap-img')
            .attr('data-img-src')
            ? $(el).find('.image .search-product-wrap-img').attr('data-img-src')
            : $(el).find('.image .search-product-wrap-img').attr('src'),
          link: $(el).find('.search-product-link').attr('href'),
        };
      });
    });

  return {
    props: {
      searchKeyword: searchId,
      products: ulList,
    },
  };
};
