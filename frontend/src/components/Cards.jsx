import { useQuery } from "@apollo/client";
import Card from "./Card";
import { GET_TRANSACTIONS } from "../../graphql/queries/transaction.query";

const Cards = () => {
	const {data,loading,error} = useQuery(GET_TRANSACTIONS)	


	return (
		<div className='w-full px-10 min-h-[40vh]'>
			<p className='text-5xl font-bold text-center my-10'>History</p>
			<div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20'>
				{!loading&& data.transactions.map((trans)=>{
					return <Card key={trans._id} transaction={trans} />
				})}
			</div>
			{!loading && data.transactions.length ==0&&(
				<p className='text-2xl font-bold text-center w-full'>No transactions found</p>
			)}
		</div>
	);
};
export default Cards;