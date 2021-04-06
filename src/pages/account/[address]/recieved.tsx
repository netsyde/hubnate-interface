import { useRouter } from 'next/router';

const Recieved = () => {
    const router = useRouter()
    const { address } = router.query

    console.log(address)
    return (
        <div></div>
    )
}

export default Recieved;