import React from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUserAgent } from 'next-useragent';

type Props = {
  searchKeyword: string;
  data: any;
};

const baseURL: string = 'https://www.coupang.com';

function ProductsPage({ searchKeyword, data }: Props) {
  return <div className="container">{data}</div>;
}

const axios = require('axios');

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { query } = context;

  console.log(context.req.headers['user-agent']);

  const searchId: string = query.q;

  const response = await axios.get(
    // `https://www.coupang.com/np/search?rocketAll=false&q=${searchId}&brand=&offerCondition=&filter=&availableDeliveryFilter=&filterType=&isPriceRange=false&priceRange=&minPrice=&maxPrice=&page=1&trcid=&traid=&filterSetByUser=true&channel=auto&backgroundColor=&searchProductCount=122651&component=&rating=0&sorter=scoreDesc&listSize=36`,
    // `https://www.coupang.com/np/search?rocketAll=false&searchId=3bc519c953cc4421b402bafab0788257&q=%EB%8B%AD%EA%B0%80%EC%8A%B4%EC%82%B4&brand=&offerCondition=&filter=&availableDeliveryFilter=&filterType=&isPriceRange=false&priceRange=&minPrice=&maxPrice=&page=1&trcid=&traid=&filterSetByUser=true&channel=user&backgroundColor=&searchProductCount=309109&component=&rating=0&sorter=scoreDesc&listSize=36`,
    `https://category.gmarket.co.kr/listview/L100000103.aspx`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3',
      },
    }
  );

  return {
    props: {
      searchKeyword: searchId,
      data: response.data,
    },
  };
};

export default ProductsPage;
