import React from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

type Props = {
  searchKeyword: string;
  data: any;
};

const baseURL: string = 'https://www.coupang.com';

function ProductsPage({ searchKeyword, data }: Props) {
  return <div className="container px-32">{data}</div>;
}

const axios = require('axios');

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { query } = context;

  const searchId: string = query.q;

  const response = await axios.get(
    // `https://www.coupang.com/np/search?rocketAll=false&q=${searchId}&brand=&offerCondition=&filter=&availableDeliveryFilter=&filterType=&isPriceRange=false&priceRange=&minPrice=&maxPrice=&page=1&trcid=&traid=&filterSetByUser=true&channel=auto&backgroundColor=&searchProductCount=122651&component=&rating=0&sorter=scoreDesc&listSize=36`,
    `https://www.naver.com/`,
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
