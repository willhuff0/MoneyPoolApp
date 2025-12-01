export const splitBalance = (debts: Map<string, number>, poolBalance: number): {
    fromUserId: string,
    toUserId: string,
    amount: number,
}[] => {
    const fairShare = poolBalance / debts.size;

    const netBalances: { [userId: string]: number } = {};
    for (const [userId, debt] of debts.entries()) {
        netBalances[userId] = debt - fairShare;
    }

    const creditors: {
        userId: string,
        amountToReceive: number,
    }[] = [];
    const debtors: {
        userId: string,
        amountToPay: number,
    }[] = [];
    for (const [userId, balance] of Object.entries(netBalances)) {
        if (Math.abs(balance) < 1e-9) continue;
        if (balance > 0) {
            creditors.push({
                userId,
                amountToReceive: balance,
            });
        } else if (balance < 0) {
            debtors.push({
                userId,
                amountToPay: -balance,
            });
        }
    }

    // Sort in descending order
    creditors.sort((a, b) => b.amountToReceive - a.amountToReceive);
    debtors.sort((a, b) => b.amountToPay - a.amountToPay);

    const transfers: {
        fromUserId: string,
        toUserId: string,
        amount: number,
    }[] = [];

    let i = 0; // index into debtors
    let j = 0; // index into creditors
    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        const amount = Math.min(debtor.amountToPay, creditor.amountToReceive);

        transfers.push({
            fromUserId: debtor.userId,
            toUserId: creditor.userId,
            amount,
        });

        debtor.amountToPay -= amount;
        creditor.amountToReceive -= amount;

        // move to next debtor/creditor when settled
        if (Math.abs(debtor.amountToPay) < 1e-9) i++;
        if (Math.abs(creditor.amountToReceive) < 1e-9) j++;
    }

    return transfers;
}