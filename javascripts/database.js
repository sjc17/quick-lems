const db = new Dexie('LEMDatabase');

db.version(1).stores({
    LEMs: '++id, client, location, PONumber, POLineItem, workDate',
    LEMItems: '++id, LEMid, workOrder, unit, quantity, rate, totalCost',
});

db.open().catch((e) => {
    console.error('Open failed: ' + e.stack);
});
