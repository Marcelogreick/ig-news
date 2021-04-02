import { GetStaticProps } from 'next'
import Head from 'next/head';

import { SubscribeButton } from '../components/subscribeButton';
import { stripe } from '../services/stripe';

import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }) {
  return (
    <>
      <Head>
        <title>Ig News</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, Welcome</span>
          <h1>News about the <span>React</span> world</h1>
          <p>
            Get to access to all publications <br/>
            <span>fo {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.piceId}/>
        </section>

        <img src="/images/avatar.svg" alt="Girl Coding"/>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1Ia4xGCgFSonuwNerN2bq90V', {
    expand: ['product']
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-us', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, //24 horas
  }
}
