const app = Vue.createApp({
    data() {
        return {
            cards: [],
            filteredCards: [],
            categories: [],
            searchQuery: "",
            selectedCategory: ""
        };
    },
    computed: {
        progressBarWidth() {
            return `${(this.filteredCards.length / this.cards.length) * 100}%`;
        }
    },
    methods: {
        async fetchCards() {
            try {
                const response = await axios.get(
                    "https://digimoncard.io/api-public/getAllCards.php",
                    {
                        params: {
                            sort: "name",
                            series: "Digimon Card Game",
                            sortdirection: "asc"
                        }
                    }
                );
                this.cards = response.data;
                this.filteredCards = [...this.cards];
                this.generateCategories();
            } catch (error) {
                console.error("Error fetching cards:", error);
            }
        },
        generateCategories() {
            const categoriesSet = new Set(
                this.cards.map(card => card.name.charAt(0))
            );
            this.categories = [...categoriesSet].sort();
        },
        filterCards() {
            this.filteredCards = this.cards.filter(card => {
                const matchesSearch = card.name
                    .toLowerCase()
                    .includes(this.searchQuery.toLowerCase());
                const matchesCategory =
                    this.selectedCategory === "" ||
                    card.name.startsWith(this.selectedCategory);
                return matchesSearch && matchesCategory;
            });
        }
    },
    mounted() {
        this.fetchCards();
    }
});

app.mount("#app");
