import BottomNavigation from "@/componentes/menu";
import { useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  
  const featuredProducts = [
    {
      id: 1,
      name: "VASK Corduroy Utility Jacket",
      price: "$65.00",
      rating: 4.5,
      image: "https://via.placeholder.com/150x150/4a90e2/ffffff?text=Jacket",
      isFavorite: false
    },
    {
      id: 2,
      name: "MONSA Oversized Graphic Jacket",
      price: "$42.00",
      rating: 4.6,
      image: "https://via.placeholder.com/150x150/e74c3c/ffffff?text=Graphic",
      isFavorite: true
    },
    {
      id: 3,
      name: "HALLEN Vest",
      price: "$68.00",
      rating: 4.8,
      image: "https://via.placeholder.com/150x150/27ae60/ffffff?text=Vest",
      isFavorite: false
    },
    {
      id: 4,
      name: "T-shirt Basic Cotton combad 24s",
      price: "$45",
      rating: 4.5,
      image: "https://via.placeholder.com/150x150/f39c12/ffffff?text=T-shirt",
      isFavorite: false
    }
  ];

  type item = {
    id: number;
    name: string;
    price: string;
    rating: number;
    image: string;
    isFavorite: boolean;
  };

  const renderProduct = ({ item }: { item: item }) => (
    <View style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <Pressable style={styles.favoriteButton}>
          <Text style={[styles.favoriteIcon, item.isFavorite && styles.favoriteActive]}>
            {item.isFavorite ? "❤️" : "🤍"}
          </Text>
        </Pressable>
      </View>
      <View style={styles.productInfo}>
        <View style={styles.ratingContainer}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationIcon}>📍</Text>
          <View>
            <Text style={styles.deliveryText}>Dirección de envío</Text>
            <Text style={styles.addressText}> Cra 47 # 5e-30 </Text>
          </View>
        </View>
       
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Banner promocional */}
        <View style={styles.bannerContainer}>
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              Oferta especial{'\n'}hasta 50% de descuento
            </Text>
            <Pressable style={styles.shopNowButton}>
              <Text style={styles.shopNowText}>Shop Now</Text>
            </Pressable>
          </View>
        </View>

        {/* Best Seller Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Best seller of the month</Text>
        </View>

        {/* Products Grid */}
        <FlatList
          data={featuredProducts}
          renderItem={renderProduct}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa"
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "white"
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8
  },
  deliveryText: {
    fontSize: 12,
    color: "#666"
  },
  addressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333"
  },
  headerIcons: {
    flexDirection: "row"
  },
  iconButton: {
    padding: 8,
    marginLeft: 4
  },
  icon: {
    fontSize: 20
  },
  scrollView: {
    flex: 1
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f3f4",
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 25
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333"
  },
  bannerContainer: {
    paddingHorizontal: 16,
    marginBottom: 20
  },
  banner: {
    backgroundColor: "#e8f4fd",
    borderRadius: 16,
    padding: 20,
    position: "relative",
    minHeight: 120
  },
  bannerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12
  },
  shopNowButton: {
    backgroundColor: "#a4e635",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start"
  },
  shopNowText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 14
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333"
  },
  productRow: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    width: "48%",
    elevation: 2,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3
  },
  productImageContainer: {
    position: "relative",
    marginBottom: 8
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    resizeMode: "cover"
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  favoriteIcon: {
    fontSize: 16
  },
  favoriteActive: {
    color: "#e74c3c"
  },
  productInfo: {
    gap: 4
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4
  },
  star: {
    fontSize: 12,
    marginRight: 4
  },
  rating: {
    fontSize: 12,
    color: "#666"
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    lineHeight: 18
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginTop: 4
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb"
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8
  },
  navIcon: {
    fontSize: 24
  },
  navActive: {
    color: "#a4e635"
  }
});