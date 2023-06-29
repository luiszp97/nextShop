import { NextPage, GetServerSideProps } from 'next';
import { Box, Typography } from '@mui/material';

import { dbProducts } from '@/database';
import { ShopLayout } from '@/components/layout';
import { ProductList } from '@/components/products';
import { IProduct } from '@/interfaces';

interface Props {
	products: IProduct[];
	foundProducts: boolean;
	query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
	return (
		<ShopLayout title={'Next-Shop'} pageDescription={'Encuentra los mejores productos'}>
			<Typography variant='h1' component='h1'>
				Buscar productos
			</Typography>

			{foundProducts ? (
				<Typography variant='h2' textTransform='capitalize' sx={{ mb: 1 }}>
					{query}
				</Typography>
			) : (
				<Box display='flex'>
					<Typography variant='h2' sx={{ mb: 1 }}>
						No se encontro ningun producto por:
					</Typography>
					<Typography variant='h2' color='secondary' textTransform='capitalize' sx={{ ml: 1 }}>
						{query}
					</Typography>
				</Box>
			)}

			<ProductList products={products} />
		</ShopLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const { query = '' } = params as { query: string };

	if (query.length === 0) {
		return {
			redirect: {
				destination: '/',
				permanent: true
			}
		};
	}

	let products = await dbProducts.getProductsByTerm(query);
	const foundProducts = products.length > 0;

	if (!foundProducts) {
		products = await dbProducts.getAllProducts();
	}

	return {
		props: {
			products,
			foundProducts,
			query
		}
	};
};

export default SearchPage;
