import React from 'react';
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

function ProductsPage({ searchKeyword, products }: Props) {
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

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { query } = context;

  const searchId: string = query.q;

  const response = await axios.get(
    `https://www.coupang.com/np/search?rocketAll=false&q=${searchId}&brand=&offerCondition=&filter=&availableDeliveryFilter=&filterType=&isPriceRange=false&priceRange=&minPrice=&maxPrice=&page=1&trcid=&traid=&filterSetByUser=true&channel=auto&backgroundColor=&searchProductCount=122651&component=&rating=0&sorter=scoreDesc&listSize=36`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3',
      },
    }
  );

  const $ = cheerio.load(response.data);

  console.log(response.data);
  const searchKeyword = searchId;

  let ulList: any[] = [];
  const bodyList: any[] = $('#productList>li');
  bodyList.map((i, el) => {
    ulList[i] = {
      no: i,
      title: $(el).find('.descriptions .name').text(),
      image: $(el).find('.image .search-product-wrap-img').attr('data-img-src')
        ? $(el).find('.image .search-product-wrap-img').attr('data-img-src')
        : $(el).find('.image .search-product-wrap-img').attr('src'),
      link: $(el).find('.search-product-link').attr('href'),
    };
  });

  return {
    props: {
      searchKeyword: searchKeyword,
      products: ulList,
    },
  };
};

export default ProductsPage;
