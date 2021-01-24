using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Savewise.Models
{
    public class CategoryType
    {
        public int? ctId { get; set; }
        public string ctName { get; set; }

        public ICollection<Category> Categories { get; set; }
    }

    public class CategoryTypeConfig : IEntityTypeConfiguration<CategoryType>
    {
        public void Configure(EntityTypeBuilder<CategoryType> builder)
        {
            builder.ToTable("categorytypes");

            builder.HasKey(ct => ct.ctId)
                   .HasName("PK_CategoryTypes");

            builder.Property(ct => ct.ctId)
                   .HasColumnName("ct_id")
                   .HasColumnType("int")
                   .ValueGeneratedOnAdd()
                   .IsRequired();

            builder.Property(ct => ct.ctName)
                   .HasColumnName("ct_name")
                   .HasColumnType("varchar")
                   .HasMaxLength(15)
                   .IsRequired();
        }
    }
}