using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Savewise.Models
{
    public class Category
    {
        public int? cId { get; set; }
        public string cName { get; set; }
        public int cUsrId { get; set; }
        public int cTypeId { get; set; }

        public virtual User userNavigation { get; set; }
        public virtual CategoryType categoryTypeNavigation { get; set; }
        public List<Transaction> transactions { get; set; }
    }

    public class CategoryConfig : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder.ToTable("categories");

            builder.HasKey(c => c.cId)
                   .HasName("PK_Categories");

            builder.Property(c => c.cId)
                   .ValueGeneratedOnAdd()
                   .HasColumnName("c_id")
                   .HasColumnType("int")
                   .IsRequired();

            builder.Property(c => c.cName)
                   .HasColumnName("c_name")
                   .HasColumnType("varchar")
                   .HasMaxLength(80)
                   .IsRequired();

            builder.Property(c => c.cUsrId)
                   .HasColumnName("c_user_id")
                   .HasColumnType("int");

            builder.Property(c => c.cTypeId)
                   .HasColumnName("c_category_type_id")
                   .HasColumnType("int");

            builder.HasOne(c => c.userNavigation)
                   .WithMany(u => u.categories)
                   .HasForeignKey(c => c.cUsrId);
              
            builder.HasOne(c => c.categoryTypeNavigation)
                   .WithMany(ct => ct.Categories)
                   .HasForeignKey(c => c.cTypeId)
                   .HasPrincipalKey(ct => ct.ctId)
                   .HasConstraintName("FK_Categories_CategoryTypes");

        }
    }
}