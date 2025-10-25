import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getProduct } from "./lib/getProduct";
import ArtistInfo from "./product-detail/ArtistInfo";
import ProductActions from "./product-detail/ProductActions";
import ProductHeader from "./product-detail/ProductHeader";
import ProductImages from "./product-detail/ProductImages";
import ProductManagement from "./product-detail/ProductManagement";
import ProductReviews from "./product-detail/ProductReviews";
import { getUserRolesAndRelations } from "./lib/getUserRoleAndRelation";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  // Session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Product + Reviews
  const { product, reviews } = await getProduct(productId);

  // Average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  // User roles & permissions
  let canEditProduct = false;
  let canDeleteProduct = false;
  let isAdmin = false;
  let isAgent = false;
  let isAgentForThisArtist = false;
  let isBuyer = false;

  if (session) {
    const userData = await getUserRolesAndRelations(session.user.id, product.artist.id);
    const roles = userData.roles;
    isAgentForThisArtist = userData.isAgentForArtist;

    const isProductOwner = session.user.id === product.artist.userId;

    canEditProduct = isProductOwner || roles.includes("admin") || (roles.includes("agent") && isAgentForThisArtist);
    canDeleteProduct = isProductOwner || roles.includes("admin");
    isAdmin = roles.includes("admin");
    isAgent = roles.includes("agent");
    isBuyer = roles.includes("buyer");
  } else {
    // Treat non-logged-in users as buyers
    isBuyer = true;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8">
      {/* Management Actions */}
      <ProductManagement
        product={product}
        canEditProduct={canEditProduct}
        canDeleteProduct={canDeleteProduct}
        isAdmin={isAdmin}
        isAgent={isAgent}
        isAgentForThisArtist={isAgentForThisArtist}
      />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <ProductImages images={product.images} name={product.name} />

        <div className="space-y-6">
          {/* Product Header */}
          <ProductHeader product={product} averageRating={averageRating} reviews={reviews} />

          {/* Buyer Actions */}
          <ProductActions product={product} isBuyer={isBuyer} />
        </div>
      </div>

      {/* Artist Info */}
      <ArtistInfo artist={product.artist} />

      {/* Reviews Section */}
      <ProductReviews reviews={reviews} />
    </div>
  );
}
