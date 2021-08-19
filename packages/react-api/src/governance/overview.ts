// // Copyright 2017-2020 @polkadot/api-derive authors & contributors
// // SPDX-License-Identifier: Apache-2.0
//
// import type { Observable } from '@polkadot/x-rxjs';
// import type { ApiInterfaceRx } from '@polkadot/api/types';
//
// import { combineLatest } from '@polkadot/x-rxjs';
// import { map, switchMap } from '@polkadot/x-rxjs/operators';
// import { hexToString } from '@polkadot/util';
// import { u64 } from '@cennznet/types';
//
// /**
//  * @description Retrieve the proposal overview
//  */
// export function proposals(instanceId: string, api: ApiInterfaceRx) {
//   return (): Observable<any> => {
//     return api.query.governance.nextProposalId().pipe(
//       switchMap(
//         (nextProposalId): Observable<any> => {
//           const queryArgsList = [];
//           for (let i = 0; i < (nextProposalId as u64).toNumber(); i++) {
//             queryArgsList.push({ proposalId: i });
//           }
//           return combineLatest(
//             [
//               api.query.governance.proposalCalls.multi(queryArgsList.map((arg) => [arg.proposalId])),
//               api.query.governance.proposals.multi(queryArgsList.map((arg) => [arg.proposalId])),
//               (api.rpc as any).governance.getProposalVotes()
//             ]).pipe(
//             map(([proposalCalls, proposals, votes]: [any, any, any]) => {
//               const proposalDetails = proposalCalls.map((call: any, idx: any) => {
//                 if (proposals[idx].isSome) {
//                   const proposalDetail = proposals[idx].unwrap().toJSON();
//                   return {
//                     id: idx,
//                     proposal: {
//                       call: call,
//                       sponsor: proposalDetail.sponsor,
//                       justificationCid: hexToString(proposalDetail.justificationUri),
//                       enactmentDelay: proposalDetail.enactmentDelay
//                     },
//                     votes: votes.length > 0 ? votes.toJSON().find((vote: { proposalId: number; }) => vote.proposalId === idx)?.votes : []
//                   };
//                 }
//               });
//               return proposalDetails.filter((proposal: any) => proposal !== undefined);
//             })
//           );
//         }
//       )
//     );
//   };
// }
// /**
//  * @description Retrieve the proposal overview
//  */
// // export function proposals(instanceId: string, api: ApiInterfaceRx): () => Observable<any> {
// //   return memo(
// //     instanceId,
// //     (): Observable<any> =>
// //       combineLatest([
// //         api.query.governance.proposalCalls.entries(),
// //         api.query.governance.proposalCalls.keys(),
// //       ]).pipe(
// //         map(([entries, proposalIds]) => {
// //           const proposalAttributeMap = entries.reduce((acc, detail, idx) => {
// //             const index = entries[idx][0].toString();
// //             // @ts-ignore
// //             acc[index] = detail[1];
// //             return acc;
// //           }, {});
// //           console.log('proposalAttributeMap:',proposalAttributeMap);
// //           return proposalAttributeMap;
// //         })))
// // }
