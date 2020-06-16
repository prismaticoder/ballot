<template>
  <div class="container">
    <h3 class="main-header mt-4" style="text-align: center;">Download Voter List</h3>
    <hr>

    <div class="container mt-5">
        <ul class="text-left list-group-flush">
            <a href="#downloadList" class="list-group-item mt-1 blueColor" @click.prevent="downloadAll()">All Eligible Voters (PDF) <v-icon>mdi-download</v-icon> </a>
            <a href="#downloadVoters" class="list-group-item mt-1 blueColor" @click.prevent="downloadAccredited()">All Accredited Voters (PDF) <v-icon>mdi-download</v-icon> </a>
        </ul>
    </div>
</div>
</template>

<script>

import jsPDF from 'jspdf';
import 'jspdf-autotable';


export default {
    name: "Voters",
    data() {
        return {
            type: process.env.VUE_APP_TYPE.toLowerCase(),
            name: process.env.VUE_APP_NAME
        }
    },
    methods: {
        downloadAll() {
            this.$http.get('admin/voters')
            .then(res => {
                if (res.data.voters.length > 0) {
                    let voters = res.data.voters.map((voter,index) => {
                    return [index+1 , voter.matric, voter.fullName, voter.level, voter.department]
                    })

                    var doc = new jsPDF();

                    var header = function () {
                        doc.setFontSize(15);
                        doc.setFontStyle('normal');
                        doc.text(`${process.env.VUE_APP_NAME.toUpperCase()} ELIGIBLE VOTERS LIST`, 55, 20);
                    };

                    doc.autoTable({
                        head: [['S/N', 'MATRIC. NO', 'NAME', 'LEVEL', 'DEPARTMENT']],
                        body: voters,
                        margin: {top: 30},
                        didDrawPage: header
                    })

                    let name = this.name.toLowerCase().split(' ').join('-')
                    name = name + '-voter-list.pdf'

                    doc.save(name)
                }

                else {
                    alert ("There is currently no voter list")
                }
                

            })
            .catch(err => {
                console.log(err.response)
            })
        },
        downloadAccredited() {

            this.$http.get('admin/voters?type=accredited')
            .then(res => {

                if (res.data.voters.length > 0) {
                    let voters = res.data.voters.map((voter,index) => {
                    return [index+1 , voter.matric, voter.fullName, voter.level, voter.department]
                    })
                    
                    var doc = new jsPDF();

                    var header = function () {
                        doc.setFontSize(15);
                        doc.setFontStyle('normal');
                        doc.text(`${process.env.VUE_APP_NAME.toUpperCase()} ACCREDITED VOTERS LIST`, 55, 20);
                    };

                    doc.autoTable({
                        head: [['S/N', 'MATRIC. NO', 'NAME', 'LEVEL', 'DEPARTMENT']],
                        body: voters,
                        margin: {top: 30},
                        didDrawPage: header
                    })

                    let name = this.name.toLowerCase().split(' ').join('-')
                    name = name + '-accredited-voter-list.pdf'

                    doc.save(name)
                }

                else {
                    alert ("There is currently no accredited voter list")
                }

            })
            .catch(err => {
                console.log(err.response)
            })
        },
    }
}
</script>

<style scoped>

    a {
        text-decoration: none;
    }

</style>