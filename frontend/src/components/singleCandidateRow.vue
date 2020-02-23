<template>
<div>
        <td>{{candidate.matric}}</td>
        <td class="text-capitalize fullName">{{candidate.fullName}}</td>
        <td>{{candidate.level}}</td>
        <td class="text-capitalize">{{candidate.status}}</td>
        <td v-if="candidate.status == 'confirmed'" class="text-center" title="This candidate is already confirmed">-</td>
        <td v-else class="text-center editor confirmBtn" @click="$emit('acceptCandidate', candidate.id)" title="Accept Candidate Application"><button>Accept</button></td>
        <td class="text-center editor denyBtn" @click="$emit('rejectCandidate', candidate.id)" title="Reject/Overturn Candidate Application"><button>Reject</button></td>
        <td><a class="specColor" href="">See Full Details</a></td>
    </div>
</template>

<script>
export default {
    name: 'singleCandidateRow',
    props: ["candidate"]
}
</script>