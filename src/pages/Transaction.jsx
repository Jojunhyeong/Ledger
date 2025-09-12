import FiltersBar from "@/components/transactions/FiltersBar";
import NewTransactionForm from "@/components/transactions/NewTransactionForm";
import TransactionList from "@/components/transactions/TransactionList";
import TransactionTable from "@/components/transactions/TransactionTable";

export default function Transaction() {
    return(
        <div className="flex flex-col items-center md:mt-0 mt-14">
            {/* <FiltersBar/> */}
            <NewTransactionForm/>
            <TransactionTable/>
    </div>
    )
}