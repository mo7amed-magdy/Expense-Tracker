import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import toast from "react-hot-toast"

import Cards from "../components/Cards";

import { MdLogout } from "react-icons/md";
import TransactionForm from "../components/TransactionForm.jsx";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { LOG_OUT } from "../../graphql/mutations/user.mutations.js";
import { GET_STATISTICS } from "../../graphql/queries/transaction.query";
import { useEffect, useState } from "react";
import { GET_AUTH_USER } from './../../graphql/queries/user.query';

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
	const  { data:userData } = useQuery(GET_AUTH_USER);
	const  { data,error } = useQuery(GET_STATISTICS);
	console.log("test");
	const [logout, { loading }] = useMutation(LOG_OUT, {
		refetchQueries: ['GetAuthUser']
	  });
	  
	  const client = useApolloClient(); // This gives you the Apollo Client instance
	  
	  const handleLogout = async () => {
		try {
		  await logout();
		  client.resetStore(); // clears the cache and refetches the data from the server
		} catch (error) {
		  console.error('Error: ', error);
		  toast.error(error.message);
		}
	  };
	
	const [chartData,setChartData] = useState({
		labels: [],
		datasets: [
			{
				label: "$",
				data: [],
				backgroundColor: [],
				borderColor: [],
				borderWidth: 1,
				borderRadius: 30,
				spacing: 10,
				cutout: 130,
			},
		],
	});

	useEffect(()=>{
		if(data?.categoryStatistics){
			let categories = data.categoryStatistics.map((stat) => stat.category)
			let totalAmount = data.categoryStatistics.map((stat) => stat.totalAmount)
			let backgroundColor=[]
			let borderColor=[]
			for(let i=0;i<categories.length;i++){
                if(categories[i]=="saving"){
					backgroundColor.push("rgba(75, 192, 192)")
					borderColor.push("rgba(75, 192, 192)")
				}
                else if(categories[i]=="expense"){
					backgroundColor.push("rgba(255, 99, 132)")
					borderColor.push("rgba(255, 99, 132)")
				}
                else if(categories[i]=="investment"){
					backgroundColor.push("rgba(54, 162, 235)")
					borderColor.push("rgba(54, 162, 235, 1)")
				}
            }
			setChartData(prev =>({
                labels: categories,
                datasets: [{...prev.datasets[0], data: totalAmount, backgroundColor: backgroundColor, borderColor: borderColor }],
			}))
		}

	},[data])
	

	

	

	return (
		<>
			<div className='flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center'>
				<div className='flex items-center'>
					<p className='md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text'>
						Spend wisely, track wisely
					</p>
					<img
						src={userData?.authUser.profilePicture}
						className='w-11 h-11 rounded-full border cursor-pointer'
						alt='Avatar'
					/>
					{!loading && <MdLogout className='mx-2 w-5 h-5 cursor-pointer' onClick={handleLogout} />}
					{/* loading spinner */}
					{loading && <div className='w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin'></div>}
				</div>
				<div className='flex flex-wrap w-full justify-center items-center gap-6'>
					{data?.categoryStatistics.length>0 && (
						<div className='h-[330px] w-[330px] md:h-[360px] md:w-[360px]  '>
						<Doughnut data={chartData} />
					</div>
					)}

					<TransactionForm />
				</div>
				<Cards />
			</div>
		</>
	);
};
export default HomePage;